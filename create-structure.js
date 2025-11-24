const fs = require('fs');
const path = require('path');

// Create directories
const dirs = [
  'backend/src/main/java/com/expensetracker/models',
  'backend/src/main/java/com/expensetracker/services',
  'backend/src/main/java/com/expensetracker/utils',
  'backend/data',
  'frontend/src/app/login',
  'frontend/src/app/register',
  'frontend/src/app/dashboard',
  'frontend/src/components',
  'frontend/src/utils'
];

dirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  fs.mkdirSync(fullPath, { recursive: true });
  console.log(`Created directory: ${dir}`);
});

console.log('\nDirectories created successfully!');
console.log('Now creating files...\n');

// Define all files with their content
const files = {
  'backend/data/users.json': '[]',
  'backend/data/transactions.json': '[]',
  'backend/pom.xml': `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.expensetracker</groupId>
    <artifactId>expense-tracker-backend</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <name>Expense Tracker Backend</name>

    <properties>
        <maven.compiler.source>11</maven.compiler.source>
        <maven.compiler.target>11</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <dependency>
            <groupId>com.google.code.gson</groupId>
            <artifactId>gson</artifactId>
            <version>2.10.1</version>
        </dependency>

        <dependency>
            <groupId>org.apache.poi</groupId>
            <artifactId>poi-ooxml</artifactId>
            <version>5.2.3</version>
        </dependency>

        <dependency>
            <groupId>org.mindrot</groupId>
            <artifactId>jbcrypt</artifactId>
            <version>0.4</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.11.0</version>
            </plugin>
            <plugin>
                <groupId>org.codehaus.mojo</groupId>
                <artifactId>exec-maven-plugin</artifactId>
                <version>3.1.0</version>
                <configuration>
                    <mainClass>com.expensetracker.ExpenseTrackerServer</mainClass>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>`,

  'backend/src/main/java/com/expensetracker/ExpenseTrackerServer.java': `package com.expensetracker;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

public class ExpenseTrackerServer {
    private static final int PORT = 8080;

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
        
        server.createContext("/api/health", exchange -> {
            String response = "{\\"status\\":\\"ok\\"}";
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.sendResponseHeaders(200, response.length());
            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes());
            os.close();
        });
        
        server.setExecutor(null);
        server.start();
        System.out.println("Server started on port " + PORT);
    }
}`,

  'backend/src/main/java/com/expensetracker/models/User.java': `package com.expensetracker.models;

public class User {
    private String id;
    private String username;
    private String email;
    private String passwordHash;

    public User() {}

    public User(String id, String username, String email, String passwordHash) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }
}`,

  'backend/src/main/java/com/expensetracker/models/Transaction.java': `package com.expensetracker.models;

public class Transaction {
    private String id;
    private String userId;
    private String type;
    private double amount;
    private String category;
    private String description;
    private String date;

    public Transaction() {}

    public Transaction(String id, String userId, String type, double amount, 
                      String category, String description, String date) {
        this.id = id;
        this.userId = userId;
        this.type = type;
        this.amount = amount;
        this.category = category;
        this.description = description;
        this.date = date;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}`,

  'backend/src/main/java/com/expensetracker/models/MonthlyReport.java': `package com.expensetracker.models;

import java.util.Map;

public class MonthlyReport {
    private String month;
    private double totalIncome;
    private double totalExpense;
    private double balance;
    private Map<String, Double> categoryBreakdown;

    public MonthlyReport() {}

    public MonthlyReport(String month, double totalIncome, double totalExpense, 
                        double balance, Map<String, Double> categoryBreakdown) {
        this.month = month;
        this.totalIncome = totalIncome;
        this.totalExpense = totalExpense;
        this.balance = balance;
        this.categoryBreakdown = categoryBreakdown;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public double getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(double totalIncome) {
        this.totalIncome = totalIncome;
    }

    public double getTotalExpense() {
        return totalExpense;
    }

    public void setTotalExpense(double totalExpense) {
        this.totalExpense = totalExpense;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    public Map<String, Double> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(Map<String, Double> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }
}`,

  'backend/src/main/java/com/expensetracker/services/UserService.java': `package com.expensetracker.services;

import com.expensetracker.models.User;
import com.expensetracker.utils.JsonFileHandler;
import com.expensetracker.utils.PasswordHasher;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;
import java.util.List;
import java.util.UUID;

public class UserService {
    private static final String USERS_FILE = "data/users.json";
    private JsonFileHandler fileHandler = new JsonFileHandler();

    public User register(String username, String email, String password) {
        Type userListType = new TypeToken<List<User>>(){}.getType();
        List<User> users = fileHandler.readFromFile(USERS_FILE, userListType);
        
        for (User user : users) {
            if (user.getEmail().equals(email)) {
                throw new RuntimeException("Email already exists");
            }
        }
        
        String id = UUID.randomUUID().toString();
        String passwordHash = PasswordHasher.hashPassword(password);
        User newUser = new User(id, username, email, passwordHash);
        
        users.add(newUser);
        fileHandler.writeToFile(USERS_FILE, users);
        
        return newUser;
    }

    public User login(String email, String password) {
        Type userListType = new TypeToken<List<User>>(){}.getType();
        List<User> users = fileHandler.readFromFile(USERS_FILE, userListType);
        
        for (User user : users) {
            if (user.getEmail().equals(email) && 
                PasswordHasher.checkPassword(password, user.getPasswordHash())) {
                return user;
            }
        }
        
        throw new RuntimeException("Invalid credentials");
    }
}`,

  'backend/src/main/java/com/expensetracker/services/TransactionService.java': `package com.expensetracker.services;

import com.expensetracker.models.Transaction;
import com.expensetracker.utils.JsonFileHandler;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class TransactionService {
    private static final String TRANSACTIONS_FILE = "data/transactions.json";
    private JsonFileHandler fileHandler = new JsonFileHandler();

    public Transaction addTransaction(String userId, String type, double amount, 
                                     String category, String description, String date) {
        Type transactionListType = new TypeToken<List<Transaction>>(){}.getType();
        List<Transaction> transactions = fileHandler.readFromFile(TRANSACTIONS_FILE, transactionListType);
        
        String id = UUID.randomUUID().toString();
        Transaction newTransaction = new Transaction(id, userId, type, amount, 
                                                    category, description, date);
        
        transactions.add(newTransaction);
        fileHandler.writeToFile(TRANSACTIONS_FILE, transactions);
        
        return newTransaction;
    }

    public List<Transaction> getUserTransactions(String userId) {
        Type transactionListType = new TypeToken<List<Transaction>>(){}.getType();
        List<Transaction> transactions = fileHandler.readFromFile(TRANSACTIONS_FILE, transactionListType);
        
        return transactions.stream()
                .filter(t -> t.getUserId().equals(userId))
                .collect(Collectors.toList());
    }

    public boolean deleteTransaction(String transactionId, String userId) {
        Type transactionListType = new TypeToken<List<Transaction>>(){}.getType();
        List<Transaction> transactions = fileHandler.readFromFile(TRANSACTIONS_FILE, transactionListType);
        
        boolean removed = transactions.removeIf(t -> 
            t.getId().equals(transactionId) && t.getUserId().equals(userId));
        
        if (removed) {
            fileHandler.writeToFile(TRANSACTIONS_FILE, transactions);
        }
        
        return removed;
    }
}`,

  'backend/src/main/java/com/expensetracker/services/ExcelService.java': `package com.expensetracker.services;

import com.expensetracker.models.Transaction;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;

public class ExcelService {
    
    public void exportToExcel(List<Transaction> transactions, String filePath) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Transactions");
        
        Row headerRow = sheet.createRow(0);
        String[] columns = {"Date", "Type", "Category", "Amount", "Description"};
        
        for (int i = 0; i < columns.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(columns[i]);
            CellStyle style = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            style.setFont(font);
            cell.setCellStyle(style);
        }
        
        int rowNum = 1;
        for (Transaction transaction : transactions) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(transaction.getDate());
            row.createCell(1).setCellValue(transaction.getType());
            row.createCell(2).setCellValue(transaction.getCategory());
            row.createCell(3).setCellValue(transaction.getAmount());
            row.createCell(4).setCellValue(transaction.getDescription());
        }
        
        for (int i = 0; i < columns.length; i++) {
            sheet.autoSizeColumn(i);
        }
        
        try (FileOutputStream fileOut = new FileOutputStream(filePath)) {
            workbook.write(fileOut);
        }
        
        workbook.close();
    }
}`,

  'backend/src/main/java/com/expensetracker/utils/JsonFileHandler.java': `package com.expensetracker.utils;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.*;
import java.lang.reflect.Type;
import java.util.ArrayList;

public class JsonFileHandler {
    private Gson gson = new GsonBuilder().setPrettyPrinting().create();

    public <T> T readFromFile(String filePath, Type type) {
        try {
            File file = new File(filePath);
            if (!file.exists()) {
                file.getParentFile().mkdirs();
                file.createNewFile();
                try (FileWriter writer = new FileWriter(file)) {
                    writer.write("[]");
                }
            }

            try (FileReader reader = new FileReader(file)) {
                T data = gson.fromJson(reader, type);
                return data != null ? data : (T) new ArrayList<>();
            }
        } catch (IOException e) {
            e.printStackTrace();
            return (T) new ArrayList<>();
        }
    }

    public <T> void writeToFile(String filePath, T data) {
        try {
            File file = new File(filePath);
            file.getParentFile().mkdirs();
            
            try (FileWriter writer = new FileWriter(file)) {
                gson.toJson(data, writer);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}`,

  'backend/src/main/java/com/expensetracker/utils/PasswordHasher.java': `package com.expensetracker.utils;

import org.mindrot.jbcrypt.BCrypt;

public class PasswordHasher {
    
    public static String hashPassword(String plainPassword) {
        return BCrypt.hashpw(plainPassword, BCrypt.gensalt());
    }
    
    public static boolean checkPassword(String plainPassword, String hashedPassword) {
        return BCrypt.checkpw(plainPassword, hashedPassword);
    }
}`,

  'frontend/package.json': `{
  "name": "expense-tracker-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "^18",
    "react-dom": "^18",
    "chart.js": "^4.4.1",
    "react-chartjs-2": "^5.2.0"
  },
  "devDependencies": {
    "autoprefixer": "^10.0.1",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "eslint": "^8",
    "eslint-config-next": "14.0.4"
  }
}`,

  'frontend/next.config.js': `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig`,

  'frontend/tailwind.config.js': `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
      },
    },
  },
  plugins: [],
}`,

  'frontend/postcss.config.js': `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,

  'frontend/src/app/layout.js': `export const metadata = {
  title: 'Expense Tracker',
  description: 'Track your expenses and income',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`,

  'frontend/src/app/page.js': `'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Expense Tracker</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}`,

  'frontend/src/app/login/page.js': `'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { login } from '@/utils/api'

export default function Login() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const user = await login(formData.email, formData.password)
      localStorage.setItem('user', JSON.stringify(user))
      router.push('/dashboard')
    } catch (err) {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">Sign In</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>
        <p className="text-center">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-600">Sign Up</Link>
        </p>
      </div>
    </div>
  )
}`,

  'frontend/src/app/register/page.js': `'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { register } from '@/utils/api'

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register(formData.username, formData.email, formData.password)
      router.push('/login')
    } catch (err) {
      setError('Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">Sign Up</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600">Sign In</Link>
        </p>
      </div>
    </div>
  )
}`,

  'frontend/src/app/dashboard/page.js': `'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AddTransactionForm from '@/components/AddTransactionForm'
import MonthlyChart from '@/components/MonthlyChart'
import SummaryCards from '@/components/SummaryCards'
import { getTransactions } from '@/utils/api'

export default function Dashboard() {
  const router = useRouter()
  const [transactions, setTransactions] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      router.push('/login')
      return
    }
    const userData = JSON.parse(userStr)
    setUser(userData)
    loadTransactions(userData.id)
  }, [router])

  const loadTransactions = async (userId) => {
    try {
      const data = await getTransactions(userId)
      setTransactions(data)
    } catch (err) {
      console.error('Failed to load transactions')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  const handleTransactionAdded = () => {
    if (user) {
      loadTransactions(user.id)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Expense Tracker</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <SummaryCards transactions={transactions} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <AddTransactionForm userId={user?.id} onTransactionAdded={handleTransactionAdded} />
          <MonthlyChart transactions={transactions} />
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Type</th>
                  <th className="text-left py-2">Category</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Description</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b">
                    <td className="py-2">{transaction.date}</td>
                    <td className="py-2">
                      <span className={\`px-2 py-1 rounded \${
                        transaction.type === 'income' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }\`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="py-2">{transaction.category}</td>
                    <td className="py-2">\${transaction.amount}</td>
                    <td className="py-2">{transaction.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}`,

  'frontend/src/components/AddTransactionForm.js': `'use client'
import { useState } from 'react'
import { addTransaction } from '@/utils/api'

export default function AddTransactionForm({ userId, onTransactionAdded }) {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addTransaction(userId, formData)
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      })
      onTransactionAdded()
    } catch (err) {
      console.error('Failed to add transaction')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Add Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            className="w-full border border-gray-300 rounded-md p-2"
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="number"
            step="0.01"
            required
            className="w-full border border-gray-300 rounded-md p-2"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            type="text"
            required
            className="w-full border border-gray-300 rounded-md p-2"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-2"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            required
            className="w-full border border-gray-300 rounded-md p-2"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Add Transaction
        </button>
      </form>
    </div>
  )
}`,

  'frontend/src/components/MonthlyChart.js': `'use client'
import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default function MonthlyChart({ transactions }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d')
      
      const monthlyData = transactions.reduce((acc, t) => {
        const month = t.date.substring(0, 7)
        if (!acc[month]) {
          acc[month] = { income: 0, expense: 0 }
        }
        if (t.type === 'income') {
          acc[month].income += t.amount
        } else {
          acc[month].expense += t.amount
        }
        return acc
      }, {})

      const labels = Object.keys(monthlyData).sort()
      const incomeData = labels.map(m => monthlyData[m].income)
      const expenseData = labels.map(m => monthlyData[m].expense)

      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Income',
              data: incomeData,
              backgroundColor: 'rgba(34, 197, 94, 0.5)',
              borderColor: 'rgb(34, 197, 94)',
              borderWidth: 1
            },
            {
              label: 'Expense',
              data: expenseData,
              backgroundColor: 'rgba(239, 68, 68, 0.5)',
              borderColor: 'rgb(239, 68, 68)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      })
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [transactions])

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Monthly Overview</h2>
      <div style={{ height: '300px' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  )
}`,

  'frontend/src/components/SummaryCards.js': `export default function SummaryCards({ transactions }) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-500 text-sm mb-2">Total Income</h3>
        <p className="text-3xl font-bold text-green-600">\${totalIncome.toFixed(2)}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-500 text-sm mb-2">Total Expense</h3>
        <p className="text-3xl font-bold text-red-600">\${totalExpense.toFixed(2)}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-500 text-sm mb-2">Balance</h3>
        <p className={\`text-3xl font-bold \${balance >= 0 ? 'text-blue-600' : 'text-red-600'}\`}>
          \${balance.toFixed(2)}
        </p>
      </div>
    </div>
  )
}`,

  'frontend/src/utils/api.js': `const API_URL = 'http://localhost:8080/api'

export async function register(username, email, password) {
  const response = await fetch(\`\${API_URL}/register\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  })
  if (!response.ok) throw new Error('Registration failed')
  return response.json()
}

export async function login(email, password) {
  const response = await fetch(\`\${API_URL}/login\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (!response.ok) throw new Error('Login failed')
  return response.json()
}

export async function addTransaction(userId, transaction) {
  const response = await fetch(\`\${API_URL}/transactions\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, ...transaction })
  })
  if (!response.ok) throw new Error('Failed to add transaction')
  return response.json()
}

export async function getTransactions(userId) {
  const response = await fetch(\`\${API_URL}/transactions/\${userId}\`)
  if (!response.ok) throw new Error('Failed to fetch transactions')
  return response.json()
}

export async function deleteTransaction(transactionId, userId) {
  const response = await fetch(\`\${API_URL}/transactions/\${transactionId}\`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  })
  if (!response.ok) throw new Error('Failed to delete transaction')
  return response.json()
}`
};

// Write all files
Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  const dir = path.dirname(fullPath);
  
  // Ensure directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(\`Created: \${filePath}\`);
});

console.log('\\n✅ All files created successfully!');
console.log('\\nNext steps:');
console.log('1. Backend: cd backend && mvn clean install && mvn exec:java');
console.log('2. Frontend: cd frontend && npm install && npm run dev');
