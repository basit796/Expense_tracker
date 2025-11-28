package com.expensetracker.models;

public class Budget {
    private String id;
    private String username;
    private String category;
    private double amount;
    private String month; // Format: "2024-11"
    private String currency;
    private String createdAt;

    public Budget() {}

    public Budget(String id, String username, String category, double amount, 
                  String month, String currency, String createdAt) {
        this.id = id;
        this.username = username;
        this.category = category;
        this.amount = amount;
        this.month = month;
        this.currency = currency;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
