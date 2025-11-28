package com.expensetracker.services;

import com.expensetracker.models.Budget;
import com.expensetracker.models.Transaction;
import com.expensetracker.utils.JsonFileHandler;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

public class BudgetService {
    private static final String BUDGETS_FILE = "data/budgets.json";
    private final Gson gson = new Gson();
    private final JsonFileHandler fileHandler = new JsonFileHandler();

    public List<Budget> getAllBudgets() {
        String json = fileHandler.readJsonObject("budgets.json");
        if (json.isEmpty() || json.equals("{}") || json.equals("[]")) {
            return new ArrayList<>();
        }
        Type listType = new TypeToken<ArrayList<Budget>>(){}.getType();
        return gson.fromJson(json, listType);
    }

    public Budget createBudget(Budget budget) {
        List<Budget> budgets = getAllBudgets();
        
        // Check if budget exists for this category and month
        Optional<Budget> existing = budgets.stream()
            .filter(b -> b.getUsername().equals(budget.getUsername()) &&
                        b.getCategory().equals(budget.getCategory()) &&
                        b.getMonth().equals(budget.getMonth()))
            .findFirst();

        if (existing.isPresent()) {
            // Update existing budget
            existing.get().setAmount(budget.getAmount());
            fileHandler.writeJsonObject("budgets.json", gson.toJson(budgets));
            return existing.get();
        } else {
            // Create new budget
            budget.setId(UUID.randomUUID().toString());
            budget.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
            budgets.add(budget);
            fileHandler.writeJsonObject("budgets.json", gson.toJson(budgets));
            return budget;
        }
    }

    public List<Budget> getUserBudgets(String username, String month) {
        return getAllBudgets().stream()
            .filter(b -> b.getUsername().equals(username) &&
                        (month == null || b.getMonth().equals(month)))
            .collect(Collectors.toList());
    }

    public Map<String, Object> getBudgetStatus(String username, String month, List<Transaction> transactions) {
        List<Budget> userBudgets = getUserBudgets(username, month);
        
        // Calculate spending per category for the month
        Map<String, Double> categorySpending = transactions.stream()
            .filter(t -> t.getUsername().equals(username) &&
                        t.getType().equals("expense") &&
                        t.getDate().startsWith(month))
            .collect(Collectors.groupingBy(
                Transaction::getCategory,
                Collectors.summingDouble(Transaction::getAmount)
            ));

        List<Map<String, Object>> budgetStatus = new ArrayList<>();
        List<Map<String, Object>> alerts = new ArrayList<>();

        for (Budget budget : userBudgets) {
            double spent = categorySpending.getOrDefault(budget.getCategory(), 0.0);
            double percentage = (budget.getAmount() > 0) ? (spent / budget.getAmount()) * 100 : 0;
            
            String status = "good";
            if (percentage >= 100) {
                status = "exceeded";
            } else if (percentage >= 80) {
                status = "warning";
            }

            Map<String, Object> budgetInfo = new HashMap<>();
            budgetInfo.put("category", budget.getCategory());
            budgetInfo.put("budget", budget.getAmount());
            budgetInfo.put("spent", spent);
            budgetInfo.put("remaining", budget.getAmount() - spent);
            budgetInfo.put("percentage", Math.round(percentage * 100.0) / 100.0);
            budgetInfo.put("status", status);
            budgetInfo.put("currency", budget.getCurrency());

            budgetStatus.add(budgetInfo);

            if (status.equals("warning") || status.equals("exceeded")) {
                alerts.add(budgetInfo);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("month", month);
        result.put("budget_status", budgetStatus);
        result.put("alerts", alerts);
        
        return result;
    }

    public boolean deleteBudget(String budgetId) {
        List<Budget> budgets = getAllBudgets();
        boolean removed = budgets.removeIf(b -> b.getId().equals(budgetId));
        if (removed) {
            fileHandler.writeJsonObject("budgets.json", gson.toJson(budgets));
        }
        return removed;
    }
}
