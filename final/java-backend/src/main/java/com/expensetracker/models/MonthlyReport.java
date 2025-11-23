package com.expensetracker.models;

import java.util.Map;

public class MonthlyReport {
    private double totalIncome;
    private double totalExpense;
    private double balance;
    private Map<String, Double> categoryBreakdown;
    private int transactionCount;
    private String month;
    private double savingsVault;  // New field

    public MonthlyReport() {
    }

    public MonthlyReport(double totalIncome, double totalExpense, double balance,
                        Map<String, Double> categoryBreakdown, int transactionCount, String month) {
        this.totalIncome = totalIncome;
        this.totalExpense = totalExpense;
        this.balance = balance;
        this.categoryBreakdown = categoryBreakdown;
        this.transactionCount = transactionCount;
        this.month = month;
        this.savingsVault = 0.0;
    }
    
    public MonthlyReport(double totalIncome, double totalExpense, double balance,
                        Map<String, Double> categoryBreakdown, int transactionCount, String month, double savingsVault) {
        this.totalIncome = totalIncome;
        this.totalExpense = totalExpense;
        this.balance = balance;
        this.categoryBreakdown = categoryBreakdown;
        this.transactionCount = transactionCount;
        this.month = month;
        this.savingsVault = savingsVault;
    }

    // Getters and Setters
    public double getTotalIncome() { return totalIncome; }
    public void setTotalIncome(double totalIncome) { this.totalIncome = totalIncome; }

    public double getTotalExpense() { return totalExpense; }
    public void setTotalExpense(double totalExpense) { this.totalExpense = totalExpense; }

    public double getBalance() { return balance; }
    public void setBalance(double balance) { this.balance = balance; }

    public Map<String, Double> getCategoryBreakdown() { return categoryBreakdown; }
    public void setCategoryBreakdown(Map<String, Double> categoryBreakdown) { this.categoryBreakdown = categoryBreakdown; }

    public int getTransactionCount() { return transactionCount; }
    public void setTransactionCount(int transactionCount) { this.transactionCount = transactionCount; }

    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }
    
    public double getSavingsVault() { return savingsVault; }
    public void setSavingsVault(double savingsVault) { this.savingsVault = savingsVault; }
}
