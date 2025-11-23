package com.expensetracker.services;

import com.expensetracker.models.User;
import com.expensetracker.utils.JsonFileHandler;
import com.expensetracker.utils.PasswordHasher;

import java.util.List;
import java.util.UUID;
import java.util.Optional;

public class UserService {
    
    private static final String USERS_FILE = "users.json";
    
    public User registerUser(String username, String email, String fullName, String password, String currency) {
        List<User> users = JsonFileHandler.readList(USERS_FILE, User.class);
        
        // Check if user already exists
        boolean exists = users.stream()
            .anyMatch(u -> u.getUsername().equalsIgnoreCase(username) || 
                          u.getEmail().equalsIgnoreCase(email));
        
        if (exists) {
            throw new RuntimeException("User with this username or email already exists");
        }
        
        // Create new user
        String id = UUID.randomUUID().toString();
        String passwordHash = PasswordHasher.hashPassword(password);
        User newUser = new User(id, username, email, fullName, passwordHash, currency);
        
        users.add(newUser);
        JsonFileHandler.writeList(USERS_FILE, users);
        
        return newUser;
    }
    
    public User loginUser(String username, String password) {
        List<User> users = JsonFileHandler.readList(USERS_FILE, User.class);
        
        Optional<User> userOpt = users.stream()
            .filter(u -> u.getUsername().equalsIgnoreCase(username))
            .findFirst();
        
        if (!userOpt.isPresent()) {
            throw new RuntimeException("Invalid username or password");
        }
        
        User user = userOpt.get();
        if (!PasswordHasher.verifyPassword(password, user.getPasswordHash())) {
            throw new RuntimeException("Invalid username or password");
        }
        
        return user;
    }
    
    public User getUser(String username) {
        List<User> users = JsonFileHandler.readList(USERS_FILE, User.class);
        
        return users.stream()
            .filter(u -> u.getUsername().equalsIgnoreCase(username))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public User updateUserName(String username, String newFullName) {
        List<User> users = JsonFileHandler.readList(USERS_FILE, User.class);
        
        User user = users.stream()
            .filter(u -> u.getUsername().equalsIgnoreCase(username))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setFullName(newFullName);
        JsonFileHandler.writeList(USERS_FILE, users);
        
        return user;
    }
    
    public User resetPassword(String username, String oldPassword, String newPassword) {
        List<User> users = JsonFileHandler.readList(USERS_FILE, User.class);
        
        User user = users.stream()
            .filter(u -> u.getUsername().equalsIgnoreCase(username))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!PasswordHasher.verifyPassword(oldPassword, user.getPasswordHash())) {
            throw new RuntimeException("Current password is incorrect");
        }
        
        user.setPasswordHash(PasswordHasher.hashPassword(newPassword));
        JsonFileHandler.writeList(USERS_FILE, users);
        
        return user;
    }
    
    public User updateCurrency(String username, String currency) {
        List<User> users = JsonFileHandler.readList(USERS_FILE, User.class);
        
        User user = users.stream()
            .filter(u -> u.getUsername().equalsIgnoreCase(username))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setCurrency(currency);
        JsonFileHandler.writeList(USERS_FILE, users);
        
        return user;
    }
    
    public User addToSavingsVault(String username, double amount) {
        List<User> users = JsonFileHandler.readList(USERS_FILE, User.class);
        
        User user = users.stream()
            .filter(u -> u.getUsername().equalsIgnoreCase(username))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Add to vault
        user.setSavingsVault(user.getSavingsVault() + amount);
        JsonFileHandler.writeList(USERS_FILE, users);
        
        // Create expense transaction to deduct from balance
        TransactionService transactionService = new TransactionService();
        transactionService.addTransaction(
            username, 
            "expense", 
            "Savings", 
            amount, 
            user.getCurrency(), 
            "Transfer to Savings Vault", 
            java.time.LocalDate.now().toString()
        );
        
        return user;
    }
    
    public User withdrawFromSavingsVault(String username, double amount) {
        List<User> users = JsonFileHandler.readList(USERS_FILE, User.class);
        
        User user = users.stream()
            .filter(u -> u.getUsername().equalsIgnoreCase(username))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getSavingsVault() < amount) {
            throw new RuntimeException("Insufficient funds in savings vault");
        }
        
        // Remove from vault
        user.setSavingsVault(user.getSavingsVault() - amount);
        JsonFileHandler.writeList(USERS_FILE, users);
        
        // Create income transaction to add back to balance
        TransactionService transactionService = new TransactionService();
        transactionService.addTransaction(
            username, 
            "income", 
            "Savings Withdrawal", 
            amount, 
            user.getCurrency(), 
            "Withdraw from Savings Vault", 
            java.time.LocalDate.now().toString()
        );
        
        return user;
    }
}
