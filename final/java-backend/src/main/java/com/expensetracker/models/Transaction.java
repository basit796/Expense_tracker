package com.expensetracker.models;

public class Transaction {
    private String id;
    private String username;
    private String type;
    private String category;
    private double amount;
    private double originalAmount;
    private String originalCurrency;
    private String description;
    private String date;
    private String createdAt;

    public Transaction() {
    }

    public Transaction(String id, String username, String type, String category, 
                      double amount, double originalAmount, String originalCurrency, 
                      String description, String date) {
        this.id = id;
        this.username = username;
        this.type = type;
        this.category = category;
        this.amount = amount; // Always in PKR
        this.originalAmount = originalAmount;
        this.originalCurrency = originalCurrency;
        this.description = description;
        this.date = date;
        this.createdAt = java.time.LocalDateTime.now().toString();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public double getOriginalAmount() { return originalAmount; }
    public void setOriginalAmount(double originalAmount) { this.originalAmount = originalAmount; }

    public String getOriginalCurrency() { return originalCurrency; }
    public void setOriginalCurrency(String originalCurrency) { this.originalCurrency = originalCurrency; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
