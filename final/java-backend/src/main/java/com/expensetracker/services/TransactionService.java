package com.expensetracker.services;

import com.expensetracker.models.Transaction;
import com.expensetracker.models.MonthlyReport;
import com.expensetracker.models.User;
import com.expensetracker.utils.JsonFileHandler;
import com.expensetracker.utils.CurrencyConverter;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

public class TransactionService {
    
    private static final String TRANSACTIONS_FILE = "transactions.json";
    private UserService userService = new UserService();
    
    public Transaction addTransaction(String username, String type, String category,
                                     double amount, String currency, String description, String date) {
        List<Transaction> transactions = JsonFileHandler.readList(TRANSACTIONS_FILE, Transaction.class);
        
        // Get user's default currency
        User user = userService.getUser(username);
        String userCurrency = user.getCurrency();
        
        String id = UUID.randomUUID().toString();
        double convertedAmount = amount;
        
        // Convert to user's default currency if different
        if (!currency.equals(userCurrency)) {
            convertedAmount = CurrencyConverter.convert(amount, currency, userCurrency);
        }
        
        Transaction transaction = new Transaction(id, username, type, category,
            convertedAmount, amount, currency, description, date);
        
        transactions.add(transaction);
        JsonFileHandler.writeList(TRANSACTIONS_FILE, transactions);
        
        return transaction;
    }
    
    public List<Transaction> getUserTransactions(String username) {
        List<Transaction> transactions = JsonFileHandler.readList(TRANSACTIONS_FILE, Transaction.class);
        
        return transactions.stream()
            .filter(t -> t.getUsername().equalsIgnoreCase(username))
            .sorted((t1, t2) -> t2.getDate().compareTo(t1.getDate()))
            .collect(Collectors.toList());
    }
    
    public boolean deleteTransaction(String id) {
        List<Transaction> transactions = JsonFileHandler.readList(TRANSACTIONS_FILE, Transaction.class);
        
        boolean removed = transactions.removeIf(t -> t.getId().equals(id));
        if (removed) {
            JsonFileHandler.writeList(TRANSACTIONS_FILE, transactions);
        }
        
        return removed;
    }
    
    public MonthlyReport getMonthlyReport(String username, String month) {
        List<Transaction> transactions = getUserTransactions(username);
        
        if (month != null && !month.isEmpty()) {
            transactions = transactions.stream()
                .filter(t -> t.getDate().startsWith(month))
                .collect(Collectors.toList());
        }
        
        double totalIncome = transactions.stream()
            .filter(t -> t.getType().equals("income"))
            .mapToDouble(Transaction::getAmount)
            .sum();
        
        double totalExpense = transactions.stream()
            .filter(t -> t.getType().equals("expense"))
            .mapToDouble(Transaction::getAmount)
            .sum();
        
        Map<String, Double> categoryBreakdown = transactions.stream()
            .filter(t -> t.getType().equals("expense"))
            .collect(Collectors.groupingBy(
                Transaction::getCategory,
                Collectors.summingDouble(Transaction::getAmount)
            ));
        
        double balance = totalIncome - totalExpense;
        
        // Get user's savings vault
        double savingsVault = 0.0;
        try {
            User user = userService.getUser(username);
            savingsVault = user.getSavingsVault();
        } catch (Exception e) {
            // If user not found, savings vault is 0
        }
        
        return new MonthlyReport(totalIncome, totalExpense, balance,
            categoryBreakdown, transactions.size(), month, savingsVault);
    }
}
