# Expense Tracker - Quick Reference

## 🚀 Quick Start Commands

### First Time Setup
```bash
# Backend
cd backend
mvn clean install

# Frontend  
cd frontend
npm install
```

### Start Application
```bash
# Option 1: Use the quick start script
.\start-app.bat

# Option 2: Manual start (2 terminals)
# Terminal 1 - Backend
cd backend
mvn exec:java -Dexec.mainClass="com.expensetracker.ExpenseTrackerServer"

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 📋 File Checklist

### Backend (12 files)
- [x] pom.xml
- [x] ExpenseTrackerServer.java
- [x] User.java
- [x] Transaction.java
- [x] MonthlyReport.java
- [x] UserService.java
- [x] TransactionService.java
- [x] ExcelService.java
- [x] JsonFileHandler.java
- [x] PasswordHasher.java
- [x] users.json
- [x] transactions.json

### Frontend (16 files)
- [x] package.json
- [x] next.config.js
- [x] tailwind.config.js
- [x] postcss.config.js
- [x] jsconfig.json
- [x] globals.css / global.css
- [x] layout.js
- [x] page.js (home)
- [x] login/page.js
- [x] register/page.js
- [x] dashboard/page.js
- [x] SummaryCards.js
- [x] AddTransactionForm.js
- [x] MonthlyChart.js
- [x] api.js

## 🔧 Key Configuration

### Backend Port: 8080
- Configured in: `ExpenseTrackerServer.java`
- Change if needed: `port(8080)`

### Frontend Port: 3000
- Default Next.js port
- Will prompt for alternative if busy

### API URL
- Set in: `frontend/src/utils/api.js`
- Default: `http://localhost:8080`

### CORS
- Enabled for: `http://localhost:3000`
- Configured in: `ExpenseTrackerServer.java`

## 📊 Features Implemented

✅ User Registration & Login
✅ Password Hashing (SHA-256)
✅ Add Income Transactions
✅ Add Expense Transactions
✅ View All Transactions
✅ Monthly Reports
✅ Category Breakdown
✅ Charts (Recharts)
✅ Excel Export (Apache POI)
✅ Responsive Design (Tailwind CSS)
✅ JSON File Storage
✅ Input Validation
✅ Error Handling

## 🎨 UI Pages

1. **Home** (`/`) - Redirects to login
2. **Login** (`/login`) - User authentication
3. **Register** (`/register`) - New account creation
4. **Dashboard** (`/dashboard`) - Main app interface
   - Summary cards (income, expense, balance)
   - Add transaction form
   - Monthly chart
   - Transaction list

## 📦 Dependencies

### Backend (Maven)
- spark-core: 2.9.4
- gson: 2.10.1
- poi-ooxml: 5.2.5
- slf4j-simple: 2.0.9

### Frontend (npm)
- next: 14.x
- react: 18.x
- tailwindcss: 3.x
- recharts: 2.x

## 🐛 Common Issues

**Issue**: Port 8080 already in use
**Fix**: Kill process or change port in ExpenseTrackerServer.java

**Issue**: npm ERR! code ELIFECYCLE
**Fix**: Delete node_modules and package-lock.json, run `npm install`

**Issue**: CORS error
**Fix**: Ensure backend CORS is set for http://localhost:3000

**Issue**: Cannot find jsconfig.json
**Fix**: File created - restart VS Code if not detected

## 📈 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /register | Create new user |
| POST | /login | Authenticate user |
| POST | /transaction | Add transaction |
| GET | /transactions?username={user} | Get transactions |
| GET | /report/monthly?username={user}&month={YYYY-MM} | Monthly report |
| GET | /export/excel?username={user}&month={YYYY-MM} | Download Excel |

## ✅ Verification

Run the test script:
```bash
.\test-setup.bat
```

Expected: All files [OK], 0 missing files

## 🎯 Next Steps After Setup

1. Open http://localhost:3000
2. Click "Register" - create account
3. Login with credentials
4. Add sample transactions:
   - Income: Salary, $5000
   - Expense: Food, $200
   - Expense: Transport, $100
5. View dashboard summary
6. Check monthly chart
7. Export to Excel

---

**Status**: ✅ Complete - All 28 core files created
**Ready to run**: Yes
**Total setup time**: ~5 minutes
