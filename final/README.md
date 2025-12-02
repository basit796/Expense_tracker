# 💰 Expense Tracker - Full Stack Application

## 🚀 Quick Start

### 1. Start Backend
```bash
cd backend
python main_firestore_uuid.py
```

### 2. Start Frontend (new terminal)
```bash
cd frontend
npm run dev
```

### 3. Open Browser
```
http://localhost:3000
```

---

## 🔐 Test Accounts

```
testuser / 123456
demo / 123456
ayankyt9 / 123456
wahab / 123456
```

**All passwords reset to:** `123456`

---

## 📊 Features

- User authentication (UUID-based)
- Transaction management (monthly filtering)
- Monthly budgets (with deletion support)
- Financial goals
  - **NEW:** Deducts from balance when contributing
  - **NEW:** Smart deletion (returns money if incomplete)
- AI chat (Google Gemini)
- Multi-currency support
- Excel export
- Charts & analytics
- Savings vault

---

## 🔧 Tech Stack

**Frontend:** Next.js 14, TypeScript, Tailwind CSS  
**Backend:** Python FastAPI, Firebase Firestore  
**AI:** Google Gemini API  
**Hosting:** Firebase (frontend), Firestore (database)

---

## 🌐 Live URLs

- **Frontend:** https://expense-tracker-11999.web.app
- **Backend Code:** https://github.com/basit796/expense-tracker-backend
- **Database:** https://console.firebase.google.com/project/expense-tracker-11999/firestore

---

## 🔒 Security

**Protected files (NEVER commit):**
- `backend/.env` - API keys
- `backend/serviceAccountKey.json` - Firebase credentials

**Current API key:** `AIzaSyDRLXwPBdLjMRDkae-pYv3LRj_tuFT2Eec`  
Location: `backend/.env`

---

## 🐛 Troubleshooting

### Can't login with old accounts?
Run the password reset script:
```bash
cd backend
python reset_passwords.py
```
This sets all passwords to `123456`

### Transactions not showing?
All transactions should appear now. The backend returns all transactions sorted by date (newest first).

### Goal contribution not reducing balance?
**Fixed!** Contributing to goals now:
- Checks if you have sufficient balance
- Creates an expense transaction (category: "Savings")
- Deducts from your balance immediately

### Want to delete a goal?
Two options:
- **Complete Goal** - Mark as done, no money refunded
- **Cancel Goal** - Get your contributed money back as income

### Can't delete budgets?
This has been fixed! Both backends now properly return budget IDs for deletion.
- Python backend: Returns `budgetId` in budget status
- Java backend: Returns `budgetId` in budget status
- Frontend: Uses the returned `budgetId` for deletion

### Port 8000 in use?
```bash
netstat -ano | findstr :8000
taskkill /PID <process_id> /F
```

---

## 📝 Project Structure

```
final/
├── frontend/         # Next.js app
├── backend/          # Python FastAPI
│   ├── main_firestore_uuid.py  # Main server
│   ├── .env         # API keys (PROTECTED)
│   ├── serviceAccountKey.json  # Firebase key (PROTECTED)
│   └── reset_passwords.py  # Reset user passwords
└── java-backend/    # Original Java version
```

---

## 🎓 For Teacher Demo

1. Start backend + frontend (see Quick Start)
2. Show features: register, transactions, budgets, goals, AI chat
3. Show Firestore database in browser
4. Show code on GitHub

---

**Status:** Production Ready ✅  
**Version:** 3.0.0  
**Updated:** Nov 28, 2025
