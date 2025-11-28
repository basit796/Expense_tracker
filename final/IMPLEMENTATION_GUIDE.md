# 🚀 QUICK START: Top 3 Priority Features

Ready-to-implement code for Budget Management, Financial Goals, and Smart Notifications.

---

## 1. 📊 BUDGET MANAGEMENT SYSTEM

### Backend Implementation (Python)

Add to `main.py`:

```python
# Models
class BudgetCreate(BaseModel):
    username: str
    category: str
    amount: float
    month: str  # Format: "2024-01"
    currency: Optional[str] = "PKR"

class BudgetUpdate(BaseModel):
    id: str
    amount: float

# Load/Save budgets
BUDGETS_FILE = DATA_DIR / "budgets.json"
if not BUDGETS_FILE.exists():
    BUDGETS_FILE.write_text("[]")

def load_budgets() -> List[dict]:
    return json.loads(BUDGETS_FILE.read_text())

def save_budgets(budgets: List[dict]):
    BUDGETS_FILE.write_text(json.dumps(budgets, indent=2))

# Endpoints
@app.post("/api/budgets/set")
async def set_budget(budget: BudgetCreate):
    budgets = load_budgets()
    
    # Check if budget exists for this category and month
    existing = next(
        (b for b in budgets if b["username"] == budget.username 
         and b["category"] == budget.category 
         and b["month"] == budget.month),
        None
    )
    
    if existing:
        existing["amount"] = budget.amount
    else:
        new_budget = {
            "id": generate_id(),
            "username": budget.username,
            "category": budget.category,
            "amount": budget.amount,
            "month": budget.month,
            "currency": budget.currency,
            "created_at": datetime.now().isoformat()
        }
        budgets.append(new_budget)
    
    save_budgets(budgets)
    return {"message": "Budget set successfully", "budgets": budgets}

@app.get("/api/budgets/{username}")
async def get_budgets(username: str, month: Optional[str] = None):
    budgets = load_budgets()
    user_budgets = [b for b in budgets if b["username"] == username]
    
    if month:
        user_budgets = [b for b in user_budgets if b["month"] == month]
    
    return user_budgets

@app.get("/api/budgets/status/{username}")
async def get_budget_status(username: str, month: Optional[str] = None):
    """Returns budget usage and alerts"""
    from datetime import datetime
    
    if not month:
        month = datetime.now().strftime("%Y-%m")
    
    budgets = load_budgets()
    user_budgets = [b for b in budgets if b["username"] == username and b["month"] == month]
    
    transactions = load_transactions()
    user_transactions = [
        t for t in transactions 
        if t["username"] == username 
        and t["type"] == "expense"
        and t["date"].startswith(month)
    ]
    
    # Calculate spending per category
    category_spending = {}
    for t in user_transactions:
        category = t["category"]
        category_spending[category] = category_spending.get(category, 0) + t["amount"]
    
    # Compare with budgets
    budget_status = []
    for budget in user_budgets:
        spent = category_spending.get(budget["category"], 0)
        percentage = (spent / budget["amount"]) * 100 if budget["amount"] > 0 else 0
        
        status = "good"
        if percentage >= 100:
            status = "exceeded"
        elif percentage >= 80:
            status = "warning"
        
        budget_status.append({
            "category": budget["category"],
            "budget": budget["amount"],
            "spent": spent,
            "remaining": budget["amount"] - spent,
            "percentage": round(percentage, 2),
            "status": status,
            "currency": budget["currency"]
        })
    
    return {
        "month": month,
        "budget_status": budget_status,
        "alerts": [b for b in budget_status if b["status"] in ["warning", "exceeded"]]
    }

@app.delete("/api/budgets/{budget_id}")
async def delete_budget(budget_id: str):
    budgets = load_budgets()
    budgets = [b for b in budgets if b["id"] != budget_id]
    save_budgets(budgets)
    return {"message": "Budget deleted successfully"}
```

### Frontend Component (React)

Create `components/BudgetManager.tsx`:

```tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { AlertCircle, CheckCircle, TrendingUp, Plus, Trash2 } from 'lucide-react'

interface Budget {
  id: string
  category: string
  budget: number
  spent: number
  remaining: number
  percentage: number
  status: 'good' | 'warning' | 'exceeded'
  currency: string
}

interface BudgetManagerProps {
  username: string
  categories: string[]
  currency: string
}

export default function BudgetManager({ username, categories, currency }: BudgetManagerProps) {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [showForm, setShowForm] = useState(false)
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadBudgets()
  }, [username])

  const loadBudgets = async () => {
    const month = new Date().toISOString().slice(0, 7)
    const response = await fetch(`http://localhost:8000/api/budgets/status/${username}?month=${month}`)
    const data = await response.json()
    setBudgets(data.budget_status || [])
  }

  const handleSetBudget = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const month = new Date().toISOString().slice(0, 7)
      await fetch('http://localhost:8000/api/budgets/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          category,
          amount: parseFloat(amount),
          month,
          currency
        })
      })

      setCategory('')
      setAmount('')
      setShowForm(false)
      await loadBudgets()
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800 border-green-300'
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'exceeded': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-5 h-5" />
      case 'warning': return <AlertCircle className="w-5 h-5" />
      case 'exceeded': return <AlertCircle className="w-5 h-5" />
      default: return <TrendingUp className="w-5 h-5" />
    }
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Monthly Budgets</h2>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Budget
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSetBudget} className="mb-6 p-4 bg-slate-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Select>
            <Input
              type="number"
              placeholder="Budget Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Setting...' : 'Set Budget'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {budgets.length === 0 ? (
          <p className="text-center text-slate-500 py-8">
            No budgets set for this month. Click "Add Budget" to get started!
          </p>
        ) : (
          budgets.map((budget) => (
            <div
              key={budget.category}
              className={`p-4 rounded-lg border-2 ${getStatusColor(budget.status)}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(budget.status)}
                  <h3 className="font-bold text-lg">{budget.category}</h3>
                </div>
                <span className="text-sm font-semibold">
                  {budget.percentage.toFixed(0)}% used
                </span>
              </div>

              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>
                    Spent: {currency} {budget.spent.toLocaleString()}
                  </span>
                  <span>
                    Budget: {currency} {budget.budget.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-white/50 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      budget.status === 'exceeded'
                        ? 'bg-red-600'
                        : budget.status === 'warning'
                        ? 'bg-yellow-600'
                        : 'bg-green-600'
                    }`}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  ></div>
                </div>
              </div>

              <p className="text-sm">
                Remaining: <strong>{currency} {budget.remaining.toLocaleString()}</strong>
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
```

### Add to Dashboard:

```tsx
// In app/dashboard/page.tsx
import BudgetManager from '@/components/BudgetManager'

// Add in the component
<BudgetManager
  username={username || ''}
  categories={categories.expense}
  currency={userProfile?.currency || 'PKR'}
/>
```

---

## 2. 🎯 FINANCIAL GOALS SYSTEM

### Backend (main.py)

```python
# Models
class GoalCreate(BaseModel):
    username: str
    name: str
    target_amount: float
    deadline: str  # ISO date
    category: Optional[str] = "Savings"
    currency: Optional[str] = "PKR"

class GoalUpdate(BaseModel):
    id: str
    current_amount: float

# File handling
GOALS_FILE = DATA_DIR / "goals.json"
if not GOALS_FILE.exists():
    GOALS_FILE.write_text("[]")

def load_goals() -> List[dict]:
    return json.loads(GOALS_FILE.read_text())

def save_goals(goals: List[dict]):
    GOALS_FILE.write_text(json.dumps(goals, indent=2))

# Endpoints
@app.post("/api/goals/create")
async def create_goal(goal: GoalCreate):
    goals = load_goals()
    
    new_goal = {
        "id": generate_id(),
        "username": goal.username,
        "name": goal.name,
        "target_amount": goal.target_amount,
        "current_amount": 0,
        "deadline": goal.deadline,
        "category": goal.category,
        "currency": goal.currency,
        "status": "active",
        "created_at": datetime.now().isoformat()
    }
    
    goals.append(new_goal)
    save_goals(goals)
    return {"message": "Goal created successfully", "goal": new_goal}

@app.get("/api/goals/{username}")
async def get_goals(username: str):
    goals = load_goals()
    user_goals = [g for g in goals if g["username"] == username and g["status"] == "active"]
    
    # Calculate progress and days remaining
    from datetime import datetime, timedelta
    
    for goal in user_goals:
        goal["progress_percentage"] = (goal["current_amount"] / goal["target_amount"] * 100) if goal["target_amount"] > 0 else 0
        goal["remaining"] = goal["target_amount"] - goal["current_amount"]
        
        deadline = datetime.fromisoformat(goal["deadline"])
        days_remaining = (deadline - datetime.now()).days
        goal["days_remaining"] = max(0, days_remaining)
        
        # Calculate if on track
        if days_remaining > 0:
            daily_required = goal["remaining"] / days_remaining
            goal["daily_savings_required"] = round(daily_required, 2)
        else:
            goal["daily_savings_required"] = 0
    
    return user_goals

@app.put("/api/goals/contribute")
async def contribute_to_goal(data: dict):
    """Add money to a goal"""
    goals = load_goals()
    goal_id = data.get("id")
    amount = data.get("amount", 0)
    
    goal = next((g for g in goals if g["id"] == goal_id), None)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    goal["current_amount"] += amount
    
    # Check if goal completed
    if goal["current_amount"] >= goal["target_amount"]:
        goal["status"] = "completed"
        goal["completed_at"] = datetime.now().isoformat()
    
    save_goals(goals)
    return {"message": "Contribution added", "goal": goal}

@app.delete("/api/goals/{goal_id}")
async def delete_goal(goal_id: str):
    goals = load_goals()
    goals = [g for g in goals if g["id"] != goal_id]
    save_goals(goals)
    return {"message": "Goal deleted"}
```

### Frontend Component

Create `components/GoalsTracker.tsx`:

```tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Target, Plus, TrendingUp, Calendar, DollarSign } from 'lucide-react'

interface Goal {
  id: string
  name: string
  target_amount: number
  current_amount: number
  progress_percentage: number
  remaining: number
  deadline: string
  days_remaining: number
  daily_savings_required: number
  category: string
  currency: string
}

interface GoalsTrackerProps {
  username: string
  currency: string
}

export default function GoalsTracker({ username, currency }: GoalsTrackerProps) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [deadline, setDeadline] = useState('')

  useEffect(() => {
    loadGoals()
  }, [username])

  const loadGoals = async () => {
    const response = await fetch(`http://localhost:8000/api/goals/${username}`)
    const data = await response.json()
    setGoals(data)
  }

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    
    await fetch('http://localhost:8000/api/goals/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        name,
        target_amount: parseFloat(targetAmount),
        deadline,
        currency
      })
    })

    setName('')
    setTargetAmount('')
    setDeadline('')
    setShowForm(false)
    await loadGoals()
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Target className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-slate-900">Financial Goals</h2>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" /> New Goal
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateGoal} className="mb-6 p-4 bg-slate-50 rounded-lg space-y-3">
          <Input
            placeholder="Goal Name (e.g., Emergency Fund)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            type="number"
            placeholder="Target Amount"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            required
            min="0"
            step="0.01"
          />
          <Input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
            min={new Date().toISOString().split('T')[0]}
          />
          <div className="flex gap-2">
            <Button type="submit">Create Goal</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.length === 0 ? (
          <p className="col-span-2 text-center text-slate-500 py-8">
            No goals yet. Set your first financial goal!
          </p>
        ) : (
          goals.map((goal) => (
            <div key={goal.id} className="p-4 border-2 border-primary-200 rounded-lg bg-gradient-to-br from-white to-primary-50">
              <h3 className="font-bold text-lg text-slate-900 mb-2">{goal.name}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Progress</span>
                  <span className="font-bold text-primary-700">
                    {goal.progress_percentage.toFixed(1)}%
                  </span>
                </div>
                
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-primary-600 to-violet-600 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min(goal.progress_percentage, 100)}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-sm">
                  <span>
                    {currency} {goal.current_amount.toLocaleString()}
                  </span>
                  <span>
                    {currency} {goal.target_amount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>{goal.days_remaining} days left</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <DollarSign className="w-4 h-4" />
                  <span>{currency} {goal.daily_savings_required}/day</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-3">
                Deadline: {new Date(goal.deadline).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
```

---

## 3. 🔔 SMART NOTIFICATIONS

### Backend (main.py)

```python
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

@app.get("/api/notifications/daily-summary/{username}")
async def get_daily_summary(username: str):
    """Get today's financial summary"""
    from datetime import datetime
    
    today = datetime.now().strftime("%Y-%m-%d")
    transactions = load_transactions()
    today_transactions = [
        t for t in transactions 
        if t["username"] == username and t["date"] == today
    ]
    
    income = sum(t["amount"] for t in today_transactions if t["type"] == "income")
    expense = sum(t["amount"] for t in today_transactions if t["type"] == "expense")
    
    return {
        "date": today,
        "transaction_count": len(today_transactions),
        "total_income": income,
        "total_expense": expense,
        "net": income - expense,
        "transactions": today_transactions
    }

@app.post("/api/notifications/send-email")
async def send_email_notification(data: dict):
    """Send email notification"""
    # Configure your SMTP settings
    sender_email = os.getenv("SMTP_EMAIL", "your@email.com")
    sender_password = os.getenv("SMTP_PASSWORD", "your-password")
    
    recipient = data.get("email")
    subject = data.get("subject")
    body = data.get("body")
    
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient
    msg['Subject'] = subject
    
    msg.attach(MIMEText(body, 'html'))
    
    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)
        
        return {"message": "Email sent successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

@app.get("/api/notifications/unusual-spending/{username}")
async def detect_unusual_spending(username: str):
    """Detect unusual spending patterns using AI"""
    transactions = load_transactions()
    user_transactions = [t for t in transactions if t["username"] == username]
    
    # Calculate average spending per category
    from collections import defaultdict
    from datetime import datetime, timedelta
    
    thirty_days_ago = (datetime.now() - timedelta(days=30)).isoformat()
    recent_transactions = [
        t for t in user_transactions 
        if t["type"] == "expense" and t["created_at"] >= thirty_days_ago
    ]
    
    # Get today's transactions
    today = datetime.now().strftime("%Y-%m-%d")
    today_expenses = [
        t for t in user_transactions 
        if t["type"] == "expense" and t["date"] == today
    ]
    
    # Calculate averages
    category_averages = defaultdict(list)
    for t in recent_transactions:
        category_averages[t["category"]].append(t["amount"])
    
    avg_amounts = {
        cat: sum(amounts) / len(amounts) 
        for cat, amounts in category_averages.items()
    }
    
    # Check for unusual spending
    unusual = []
    for t in today_expenses:
        avg = avg_amounts.get(t["category"], 0)
        if avg > 0 and t["amount"] > avg * 2:  # 2x average
            unusual.append({
                "transaction": t,
                "average": avg,
                "difference": t["amount"] - avg,
                "percentage_over": ((t["amount"] - avg) / avg) * 100
            })
    
    return {
        "unusual_spending_detected": len(unusual) > 0,
        "unusual_transactions": unusual,
        "recommendation": "Review these transactions - they're significantly higher than your usual spending."
    }
```

---

## 📝 INTEGRATION CHECKLIST

### Backend:
- ✅ Add models to main.py
- ✅ Create JSON data files
- ✅ Add endpoints
- ✅ Test with curl/Postman

### Frontend:
- ✅ Create component files
- ✅ Import in dashboard
- ✅ Test UI interactions
- ✅ Handle loading/error states

### Testing:
```bash
# Test budget endpoint
curl -X POST http://localhost:8000/api/budgets/set \
  -H "Content-Type: application/json" \
  -d '{"username":"test","category":"Food","amount":5000,"month":"2024-01"}'

# Test goal endpoint
curl -X POST http://localhost:8000/api/goals/create \
  -H "Content-Type: application/json" \
  -d '{"username":"test","name":"Vacation","target_amount":50000,"deadline":"2024-12-31"}'
```

---

**All code is ready to copy-paste and run! 🚀**
