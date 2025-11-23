package com.expensetracker.models;

public class User {
    private String id;
    private String username;
    private String email;
    private String fullName;
    private String passwordHash;
    private String currency;
    private double savingsVault;  // New field for savings vault
    private String createdAt;
    private String updatedAt;

    public User() {
    }

    public User(String id, String username, String email, String fullName, String passwordHash, String currency) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.passwordHash = passwordHash;
        this.currency = currency != null ? currency : "PKR";
        this.savingsVault = 0.0;
        this.createdAt = java.time.LocalDateTime.now().toString();
        this.updatedAt = this.createdAt;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { 
        this.fullName = fullName;
        this.updatedAt = java.time.LocalDateTime.now().toString();
    }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { 
        this.passwordHash = passwordHash;
        this.updatedAt = java.time.LocalDateTime.now().toString();
    }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { 
        this.currency = currency;
        this.updatedAt = java.time.LocalDateTime.now().toString();
    }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }

    public double getSavingsVault() { return savingsVault; }
    public void setSavingsVault(double savingsVault) { 
        this.savingsVault = savingsVault;
        this.updatedAt = java.time.LocalDateTime.now().toString();
    }
}
