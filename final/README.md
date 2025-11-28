# 💰 Expense Tracker - Complete Full Stack Application

A modern, full-stack expense tracking application with multi-currency support, visual analytics, and comprehensive user management.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js Frontend                      │
│          (TypeScript + Tailwind CSS + React)            │
│                  http://localhost:3000                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   FastAPI Layer                          │
│         (Python - API Gateway & Middleware)             │
│                  http://localhost:8000                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 Java Backend (17)                        │
│           (Business Logic & Data Layer)                 │
│                  http://localhost:9000                   │
└─────────────────────────────────────────────────────────┘
```

## ✨ Features

### 🔐 User Management
- ✅ User registration with email validation
- ✅ Secure login with SHA-256 password hashing
- ✅ Profile viewing and management
- ✅ Full name editing
- ✅ Password reset functionality
- ✅ Multi-currency preference (PKR, USD, EUR, GBP, SAR, AED)

### 💱 Currency System
- ✅ 6 supported currencies (PKR, USD, EUR, GBP, SAR, AED)
- ✅ Real-time currency conversion
- ✅ Automatic conversion to user's preferred currency
- ✅ Exchange rates stored in JSON configuration
- ✅ Currency selector in transaction forms

### 💰 Transaction Management
- ✅ Add income and expenses
- ✅ Category-based organization
- ✅ Multi-currency support per transaction
- ✅ Date tracking
- ✅ Delete functionality with confirmation
- ✅ Transaction history with filtering

### 📊 Analytics & Reports
- ✅ Monthly income/expense summary
- ✅ Category breakdown pie chart
- ✅ Income vs Expense bar chart
- ✅ Balance calculation
- ✅ Transaction count statistics
- ✅ Visual charts using Recharts library
- ✅ Toggle charts view

### 📥 Data Export
- ✅ Export transactions to Excel (.xlsx)
- ✅ Formatted with headers and styling
- ✅ Monthly or complete export options
- ✅ Professional spreadsheet layout

### 🤖 AI-Powered Chat Assistant (NEW!)
- ✅ Intelligent financial assistant powered by Google Gemini AI
- ✅ Real-time answers to financial questions
- ✅ Context-aware responses based on your transaction history
- ✅ Spending pattern analysis and insights
- ✅ Personalized money-saving recommendations
- ✅ Beautiful floating chat interface
- ✅ Message history and timestamps
- ✅ Natural conversation flow

### 💾 Savings Vault
- ✅ Separate savings account
- ✅ Add funds to vault
- ✅ Withdraw from vault
- ✅ Track savings progress
- ✅ Visual vault display

### 🎨 User Interface
- ✅ Modern, responsive design
- ✅ Gradient backgrounds and smooth animations
- ✅ Mobile-friendly interface
- ✅ Dashboard with summary cards
- ✅ Profile management page
- ✅ About page with feature showcase
- ✅ Clean navigation

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend - FastAPI (API Layer)
- **Framework**: FastAPI
- **Language**: Python 3.8+
- **HTTP Client**: httpx (for Java backend communication)
- **Excel Generation**: openpyxl
- **Data Validation**: Pydantic

### Backend - Java (Business Logic)
- **Language**: Java 17
- **Build Tool**: Maven
- **JSON Processing**: Gson 2.10.1
- **HTTP Server**: com.sun.net.httpserver (Built-in)
- **Data Storage**: JSON files

## 📁 Project Structure

```
final/
├── frontend/                 # Next.js Frontend
│   ├── app/
│   │   ├── about/           # About page
│   │   ├── dashboard/       # Main dashboard
│   │   ├── login/           # Login page
│   │   ├── profile/         # Profile management
│   │   └── register/        # Registration page
│   ├── components/          # React components
│   ├── lib/                 # API client functions
│   └── types/               # TypeScript definitions
│
├── backend/                 # FastAPI Backend
│   ├── main.py             # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── data/               # JSON data files
│
├── java-backend/           # Java Backend
│   ├── src/main/java/com/expensetracker/
│   │   ├── models/        # User, Transaction, MonthlyReport
│   │   ├── services/      # UserService, TransactionService
│   │   ├── utils/         # PasswordHasher, JsonFileHandler, CurrencyConverter
│   │   └── server/        # ExpenseTrackerServer (HTTP Server)
│   ├── pom.xml            # Maven configuration
│   └── data/              # JSON storage
│
└── start-all.bat          # Complete startup script
```

## 🚀 Quick Start

### Prerequisites

1. **Java 17+**
   ```bash
   java -version
   ```

2. **Python 3.8+**
   ```bash
   python --version
   ```

3. **Node.js 18+**
   ```bash
   node --version
   ```

4. **Maven** (for building Java)
   ```bash
   mvn --version
   ```

5. **Google Gemini API Key** (for AI chat)
   - Get your API key from: https://ai.google.dev/
   - Create `.env` file in `backend/` folder:
     ```env
     GOOGLE_API_KEY=your_api_key_here
     ```

### 🎯 One-Click Startup

**Simply run:**

```bash
cd final
start-all.bat
```

This will automatically:
1. ✅ Compile Java backend
2. ✅ Install Python dependencies
3. ✅ Install Node.js dependencies
4. ✅ Start Java backend (port 9000)
5. ✅ Start FastAPI (port 8000)
6. ✅ Start Next.js frontend (port 3000)
7. ✅ Open browser to http://localhost:3000

### 📝 Manual Setup (Optional)

#### 1. Java Backend

```bash
cd final/java-backend
mvn clean package
java -jar target/expense-tracker-core-2.0.0.jar
```

#### 2. FastAPI Backend

```bash
cd final/backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

#### 3. Frontend

```bash
cd final/frontend
npm install
npm run dev
```

## 🌐 Application URLs

- **Frontend**: http://localhost:3000
- **FastAPI**: http://localhost:8000
- **FastAPI Docs**: http://localhost:8000/docs (Interactive API documentation)
- **Java Backend**: http://localhost:9000

## 📋 API Endpoints

### User Management (via FastAPI → Java)

```
POST   /api/register              # Register new user
POST   /api/login                 # User login
GET    /api/profile/:username     # Get user profile
PUT    /api/profile/name          # Update full name
PUT    /api/profile/password      # Reset password
PUT    /api/profile/currency      # Update currency preference
```

### Transactions (via FastAPI → Java)

```
POST   /api/transactions          # Add transaction
GET    /api/transactions/:username # Get all transactions
DELETE /api/transactions/:id      # Delete transaction
```

### Reports & Analytics (via FastAPI → Java)

```
GET    /api/report/:username      # Get monthly report
GET    /api/currency/rates        # Get exchange rates
GET    /api/export/:username      # Export to Excel
```

### AI Chat (FastAPI → Gemini)

```
POST   /api/chat                  # Send message to AI assistant
POST   /api/analyze               # Analyze expenses with AI
```

### Savings Vault (via FastAPI → Java)

```
POST   /api/savings/add           # Add to savings vault
POST   /api/savings/withdraw      # Withdraw from vault
```

## 💾 Data Storage

All data is stored in JSON files in the `java-backend/data/` directory:

- **users.json**: User accounts with encrypted passwords
- **transactions.json**: All transactions with currency data
- **currency_rates.json**: Exchange rate configuration

## 🔒 Security Features

- ✅ Password hashing using SHA-256
- ✅ Input validation on all forms
- ✅ CORS protection
- ✅ SQL injection prevention (no SQL database used)
- ✅ Session management via localStorage

## 🎨 UI Features

### Dashboard
- Real-time balance calculation
- Quick transaction entry
- Recent transaction list with delete
- Summary cards (Income, Expense, Balance)
- Toggle-able charts section

### Profile Page
- View account information
- Edit full name
- Change password with verification
- Update currency preference
- Visual currency selector

### About Page
- Feature showcase
- Technology stack display
- Mission and vision
- Professional design

## 📊 Charts & Visualization

- **Pie Chart**: Expense breakdown by category
- **Bar Chart**: Income vs Expense comparison
- **Summary Cards**: Real-time statistics
- **Responsive Design**: Works on all screen sizes

## 🌍 Supported Currencies

| Code | Currency           | Symbol |
|------|--------------------|--------|
| PKR  | Pakistani Rupee    | Rs     |
| USD  | US Dollar          | $      |
| EUR  | Euro               | €      |
| GBP  | British Pound      | £      |
| SAR  | Saudi Riyal        | ﷼      |
| AED  | UAE Dirham         | د.إ    |

## 🧪 Testing

### Test User Registration
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","fullName":"Test User","password":"test123","currency":"USD"}'
```

### Test Login
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

### Health Check
```bash
# Java Backend
curl http://localhost:9000/api/java/health

# FastAPI
curl http://localhost:8000/
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000, 8000, or 9000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Java Compilation Error
```bash
cd java-backend
mvn clean package -U
```

### Python Dependencies Issue
```bash
cd backend
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

### Frontend Build Issue
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📈 Future Enhancements

### 🎯 Top Priority Features (Ready to Implement!)
See `FEATURE_SUGGESTIONS.md` and `IMPLEMENTATION_GUIDE.md` for detailed code.

1. **📊 Budget Management System**
   - Set monthly budgets per category
   - Visual progress bars and alerts
   - Budget vs actual reports
   - **Status**: Implementation ready

2. **🎯 Financial Goals Tracker**
   - Set savings goals with deadlines
   - Track progress visually
   - Calculate required daily savings
   - **Status**: Implementation ready

3. **🔔 Smart Notifications**
   - Daily spending summaries
   - Unusual spending alerts
   - Budget limit warnings
   - **Status**: Implementation ready

### 🚀 Additional Feature Ideas
- [ ] Receipt scanning (OCR)
- [ ] Recurring transactions
- [ ] Multi-user household budgeting
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Debt tracking calculator
- [ ] Gamification & achievements
- [ ] Automated transaction categorization
- [ ] Multi-currency real-time API
- [ ] Expense predictions using ML

📚 **See detailed implementations**: Check `FEATURE_SUGGESTIONS.md` for 15 feature ideas with complete code examples!

## 📄 License

MIT License - Feel free to use this project for learning and development.

## 👨‍💻 Development

Built with ❤️ using:
- Next.js for modern React development
- Java for robust business logic
- FastAPI for high-performance API layer
- Tailwind CSS for beautiful design

## 🎯 Key Achievements

✅ Complete three-tier architecture
✅ Multi-currency support with real conversion
✅ Beautiful, responsive UI
✅ Comprehensive user management
✅ Visual analytics with charts
✅ Excel export functionality
✅ Profile and About pages
✅ Secure password handling
✅ RESTful API design
✅ Clean code architecture
✅ **AI-powered chat assistant** (NEW!)
✅ Savings vault system
✅ Real-time transaction updates

## 📚 Additional Documentation

- 📖 **AI_CHAT_INTEGRATION.md** - Complete guide to AI chat system
- 💡 **FEATURE_SUGGESTIONS.md** - 15 feature ideas with implementation code
- 🚀 **IMPLEMENTATION_GUIDE.md** - Ready-to-use code for top 3 features
- 📋 **PROJECT_SUMMARY.md** - Project overview and next steps
- ⚡ **QUICK_START.md** - Quick setup guide
- 💰 **SAVINGS_VAULT_IMPLEMENTATION.md** - Savings vault details

## 🤖 Using the AI Chat

1. Login to your dashboard
2. Click the floating chat button (💬) in the bottom-right corner
3. Ask questions like:
   - "What are my top expenses?"
   - "How much did I spend this month?"
   - "Should I save more money?"
   - "What are my spending patterns?"
   - "How can I reduce my expenses?"

The AI assistant analyzes your actual transaction data and provides personalized insights!

---

**Version**: 2.0.0  
**Status**: Production Ready ✅  
**Last Updated**: November 2025

For questions or support, please check the code comments or API documentation at http://localhost:8000/docs














run backend :
C:\Users\Noman traders\Desktop\expense_tracker\final\java-backend>java -jar target/expense-tracker-core-2.0.0.jar
run frontend :
C:\Users\Noman traders\Desktop\expense_tracker\final\frontend>npm run dev
run api :
C:\Users\Noman traders\Desktop\expense_tracker\final\backend>uvicorn main:app --reload