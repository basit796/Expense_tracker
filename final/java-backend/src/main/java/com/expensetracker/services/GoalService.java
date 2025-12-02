package com.expensetracker.services;

import com.expensetracker.models.Goal;
import com.expensetracker.models.User;
import com.expensetracker.models.Transaction;
import com.expensetracker.utils.JsonFileHandler;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

public class GoalService {
    private static final String GOALS_FILE = "data/goals.json";
    private final Gson gson = new Gson();
    private final JsonFileHandler fileHandler = new JsonFileHandler();
    private final TransactionService transactionService = new TransactionService();
    private final UserService userService = new UserService();

    public List<Goal> getAllGoals() {
        String json = fileHandler.readJsonObject("goals.json");
        if (json.isEmpty() || json.equals("{}") || json.equals("[]")) {
            return new ArrayList<>();
        }
        Type listType = new TypeToken<ArrayList<Goal>>(){}.getType();
        return gson.fromJson(json, listType);
    }

    public Goal createGoal(Goal goal) {
        List<Goal> goals = getAllGoals();
        goal.setId(UUID.randomUUID().toString());
        goal.setCurrentAmount(0.0);
        goal.setStatus("active");
        goal.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        goals.add(goal);
        fileHandler.writeJsonObject("goals.json", gson.toJson(goals));
        return goal;
    }

    public List<Map<String, Object>> getUserGoals(String username) {
        List<Goal> goals = getAllGoals().stream()
            .filter(g -> g.getUsername().equals(username) && g.getStatus().equals("active"))
            .collect(Collectors.toList());

        List<Map<String, Object>> enrichedGoals = new ArrayList<>();

        for (Goal goal : goals) {
            Map<String, Object> goalInfo = new HashMap<>();
            goalInfo.put("id", goal.getId());
            goalInfo.put("name", goal.getName());
            goalInfo.put("target_amount", goal.getTargetAmount());
            goalInfo.put("current_amount", goal.getCurrentAmount());
            goalInfo.put("deadline", goal.getDeadline());
            goalInfo.put("category", goal.getCategory());
            goalInfo.put("currency", goal.getCurrency());
            goalInfo.put("status", goal.getStatus());

            // Calculate progress
            double progressPercentage = (goal.getTargetAmount() > 0) 
                ? (goal.getCurrentAmount() / goal.getTargetAmount()) * 100 
                : 0;
            goalInfo.put("progress_percentage", Math.round(progressPercentage * 100.0) / 100.0);
            goalInfo.put("remaining", goal.getTargetAmount() - goal.getCurrentAmount());

            // Calculate days remaining
            try {
                LocalDate deadline = LocalDate.parse(goal.getDeadline());
                LocalDate today = LocalDate.now();
                long daysRemaining = ChronoUnit.DAYS.between(today, deadline);
                goalInfo.put("days_remaining", Math.max(0, daysRemaining));

                // Calculate required daily savings
                if (daysRemaining > 0) {
                    double dailyRequired = (goal.getTargetAmount() - goal.getCurrentAmount()) / daysRemaining;
                    goalInfo.put("daily_savings_required", Math.round(dailyRequired * 100.0) / 100.0);
                } else {
                    goalInfo.put("daily_savings_required", 0.0);
                }
            } catch (Exception e) {
                goalInfo.put("days_remaining", 0);
                goalInfo.put("daily_savings_required", 0.0);
            }

            enrichedGoals.add(goalInfo);
        }

        return enrichedGoals;
    }

    public Goal contributeToGoal(String goalId, double amount) {
        List<Goal> goals = getAllGoals();
        Optional<Goal> goalOpt = goals.stream()
            .filter(g -> g.getId().equals(goalId))
            .findFirst();

        if (goalOpt.isPresent()) {
            Goal goal = goalOpt.get();
            
            // Calculate current balance from transactions
            List<Transaction> allTransactions = transactionService.getUserTransactions(goal.getUsername());
            double totalIncome = allTransactions.stream()
                .filter(t -> t.getType().equals("income"))
                .mapToDouble(Transaction::getAmount)
                .sum();
            double totalExpense = allTransactions.stream()
                .filter(t -> t.getType().equals("expense"))
                .mapToDouble(Transaction::getAmount)
                .sum();
            double currentBalance = totalIncome - totalExpense;
            
            // Check if user has sufficient balance
            if (currentBalance < amount) {
                throw new RuntimeException("Insufficient balance. Available: " + currentBalance);
            }
            
            // Get user's currency
            User user = userService.getUser(goal.getUsername());
            String userCurrency = user != null ? user.getCurrency() : "PKR";
            
            // Create expense transaction to deduct from balance
            transactionService.addTransaction(
                goal.getUsername(),
                "expense",
                "Savings",
                amount,
                userCurrency,
                "Contribution to goal: " + goal.getName(),
                LocalDate.now().toString()
            );
            
            // Update goal amount
            goal.setCurrentAmount(goal.getCurrentAmount() + amount);

            // Check if goal is completed
            if (goal.getCurrentAmount() >= goal.getTargetAmount()) {
                goal.setStatus("completed");
                goal.setCompletedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
            }

            fileHandler.writeJsonObject("goals.json", gson.toJson(goals));
            return goal;
        }
        return null;
    }

    public Map<String, Object> deleteGoal(String goalId, boolean completed) {
        List<Goal> goals = getAllGoals();
        Optional<Goal> goalOpt = goals.stream()
            .filter(g -> g.getId().equals(goalId))
            .findFirst();
        
        if (!goalOpt.isPresent()) {
            throw new RuntimeException("Goal not found");
        }
        
        Goal goal = goalOpt.get();
        double currentAmount = goal.getCurrentAmount();
        double targetAmount = goal.getTargetAmount();
        boolean isActuallyComplete = currentAmount >= targetAmount;
        
        Map<String, Object> result = new HashMap<>();
        result.put("was_complete", isActuallyComplete);
        result.put("returned_amount", 0.0);
        
        // If user says NOT completed and there's money, return it via income transaction
        if (!completed && currentAmount > 0) {
            // Get user's currency
            User user = userService.getUser(goal.getUsername());
            String userCurrency = user != null ? user.getCurrency() : "PKR";
            
            // Create income transaction to return money to balance
            transactionService.addTransaction(
                goal.getUsername(),
                "income",
                "Goal Refund",
                currentAmount,
                userCurrency,
                "Refund from cancelled goal: " + goal.getName(),
                LocalDate.now().toString()
            );
            
            result.put("returned_amount", currentAmount);
            result.put("message", "Goal cancelled. " + currentAmount + " returned to balance.");
        } else if (completed) {
            if (isActuallyComplete) {
                result.put("message", "🎉 Congratulations! Goal completed and removed!");
            } else {
                result.put("message", "Goal marked as completed and removed.");
            }
        } else {
            result.put("message", "Goal deleted.");
        }
        
        // Remove goal
        goals.removeIf(g -> g.getId().equals(goalId));
        fileHandler.writeJsonObject("goals.json", gson.toJson(goals));
        
        return result;
    }
}
