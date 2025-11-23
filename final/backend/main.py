from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
import json
import hashlib
from pathlib import Path
import io
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
import httpx
import asyncio

app = FastAPI(title="Expense Tracker API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

JAVA_BACKEND_URL = "http://localhost:9000"

DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)
USERS_FILE = DATA_DIR / "users.json"
TRANSACTIONS_FILE = DATA_DIR / "transactions.json"

if not USERS_FILE.exists():
    USERS_FILE.write_text("[]")
if not TRANSACTIONS_FILE.exists():
    TRANSACTIONS_FILE.write_text("[]")

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str
    fullName: str
    currency: Optional[str] = "PKR"

class UserLogin(BaseModel):
    username: str
    password: str

class TransactionCreate(BaseModel):
    username: str
    type: str
    category: str
    amount: float
    description: str
    date: str
    currency: Optional[str] = "PKR"

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def load_users() -> List[dict]:
    return json.loads(USERS_FILE.read_text())

def save_users(users: List[dict]):
    USERS_FILE.write_text(json.dumps(users, indent=2))

def load_transactions() -> List[dict]:
    return json.loads(TRANSACTIONS_FILE.read_text())

def save_transactions(transactions: List[dict]):
    TRANSACTIONS_FILE.write_text(json.dumps(transactions, indent=2))

def generate_id() -> str:
    from uuid import uuid4
    return str(uuid4())

@app.get("/")
def read_root():
    return {"message": "Expense Tracker API", "version": "2.0.0", "status": "running"}

@app.post("/api/register")
async def register(user: UserRegister):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{JAVA_BACKEND_URL}/api/java/register",
                json=user.dict(),
                timeout=10.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=response.status_code, detail=response.json().get("error", "Registration failed"))
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="Java backend unavailable")

@app.post("/api/login")
async def login(user: UserLogin):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{JAVA_BACKEND_URL}/api/java/login",
                json=user.dict(),
                timeout=10.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=response.status_code, detail=response.json().get("error", "Invalid credentials"))
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="Java backend unavailable")

@app.get("/api/profile/{username}")
async def get_profile(username: str):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{JAVA_BACKEND_URL}/api/java/profile",
                params={"username": username},
                timeout=10.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=response.status_code, detail=response.json().get("error", "User not found"))
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="Java backend unavailable")

@app.put("/api/profile/name")
async def update_name(data: dict):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.put(
                f"{JAVA_BACKEND_URL}/api/java/profile/name",
                json=data,
                timeout=10.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=response.status_code, detail=response.json().get("error", "Update failed"))
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="Java backend unavailable")

@app.put("/api/profile/password")
async def update_password(data: dict):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.put(
                f"{JAVA_BACKEND_URL}/api/java/profile/password",
                json=data,
                timeout=10.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=response.status_code, detail=response.json().get("error", "Password update failed"))
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="Java backend unavailable")

@app.put("/api/profile/currency")
async def update_currency(data: dict):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.put(
                f"{JAVA_BACKEND_URL}/api/java/profile/currency",
                json=data,
                timeout=10.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=response.status_code, detail=response.json().get("error", "Currency update failed"))
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="Java backend unavailable")

@app.post("/api/transactions")
async def add_transaction(transaction: TransactionCreate):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{JAVA_BACKEND_URL}/api/java/transactions/add",
                json=transaction.dict(),
                timeout=10.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=response.status_code, detail=response.json().get("error", "Transaction failed"))
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="Java backend unavailable")

@app.get("/api/transactions/{username}")
async def get_transactions(username: str):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{JAVA_BACKEND_URL}/api/java/transactions/get",
                params={"username": username},
                timeout=10.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=response.status_code, detail=response.json().get("error", "Failed to fetch transactions"))
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="Java backend unavailable")

@app.get("/api/report/{username}")
async def get_monthly_report(username: str, month: Optional[str] = None):
    async with httpx.AsyncClient() as client:
        try:
            params = {"username": username}
            if month:
                params["month"] = month
            response = await client.get(
                f"{JAVA_BACKEND_URL}/api/java/report",
                params=params,
                timeout=10.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=response.status_code, detail=response.json().get("error", "Report generation failed"))
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="Java backend unavailable")

@app.get("/api/currency/rates")
async def get_currency_rates():
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{JAVA_BACKEND_URL}/api/java/currency/rates",
                timeout=10.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=response.status_code, detail="Failed to fetch rates")
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="Java backend unavailable")

@app.get("/api/export/{username}")
async def export_excel(username: str, month: Optional[str] = None):
    async with httpx.AsyncClient() as client:
        try:
            params = {"username": username}
            if month:
                params["month"] = month
            response = await client.get(
                f"{JAVA_BACKEND_URL}/api/java/transactions/get",
                params=params,
                timeout=10.0
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=404, detail="User not found")
            
            user_transactions = response.json()
            
            if month:
                user_transactions = [t for t in user_transactions if t["date"].startswith(month)]
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="Java backend unavailable")
    
    wb = Workbook()
    ws = wb.active
    ws.title = "Transactions"
    
    header_fill = PatternFill(start_color="4472C4", end_color="4472C4", fill_type="solid")
    header_font = Font(color="FFFFFF", bold=True)
    
    headers = ["Date", "Type", "Category", "Amount", "Description"]
    for col, header in enumerate(headers, 1):
        cell = ws.cell(row=1, column=col, value=header)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal="center")
    
    for row, t in enumerate(user_transactions, 2):
        ws.cell(row=row, column=1, value=t["date"])
        ws.cell(row=row, column=2, value=t["type"].capitalize())
        ws.cell(row=row, column=3, value=t["category"])
        ws.cell(row=row, column=4, value=t["amount"])
        ws.cell(row=row, column=5, value=t["description"])
    
    ws.column_dimensions['A'].width = 12
    ws.column_dimensions['B'].width = 10
    ws.column_dimensions['C'].width = 15
    ws.column_dimensions['D'].width = 12
    ws.column_dimensions['E'].width = 30
    
    excel_file = io.BytesIO()
    wb.save(excel_file)
    excel_file.seek(0)
    
    filename = f"expense_report_{username}_{month or 'all'}.xlsx"
    
    return StreamingResponse(
        excel_file,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@app.delete("/api/transactions/{transaction_id}")
async def delete_transaction(transaction_id: str):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.delete(
                f"{JAVA_BACKEND_URL}/api/java/transactions/delete",
                params={"id": transaction_id},
                timeout=10.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=response.status_code, detail=response.json().get("error", "Delete failed"))
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="Java backend unavailable")


@app.post("/api/savings/add")
async def add_to_savings(data: dict):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{JAVA_BACKEND_URL}/api/java/savings/add",
                json=data,
                timeout=10.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=response.status_code, detail=response.json().get("error", "Failed to add to savings"))
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="Java backend unavailable")

@app.post("/api/savings/withdraw")
async def withdraw_from_savings(data: dict):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{JAVA_BACKEND_URL}/api/java/savings/withdraw",
                json=data,
                timeout=10.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=response.status_code, detail=response.json().get("error", "Failed to withdraw from savings"))
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="Java backend unavailable")
if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Expense Tracker FastAPI...")
    print("📍 API: http://localhost:8000")
    print("📚 Docs: http://localhost:8000/docs")
    print("🔗 Connecting to Java Backend on port 9000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
