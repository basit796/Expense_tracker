package com.expensetracker.server;

import com.expensetracker.models.User;
import com.expensetracker.models.Transaction;
import com.expensetracker.models.MonthlyReport;
import com.expensetracker.models.Budget;
import com.expensetracker.models.Goal;
import com.expensetracker.services.UserService;
import com.expensetracker.services.TransactionService;
import com.expensetracker.services.BudgetService;
import com.expensetracker.services.GoalService;
import com.expensetracker.utils.CurrencyConverter;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

public class ExpenseTrackerServer {
    
    private static final Gson gson = new Gson();
    private static final UserService userService = new UserService();
    private static final TransactionService transactionService = new TransactionService();
    private static final BudgetService budgetService = new BudgetService();
    private static final GoalService goalService = new GoalService();
    
    public static void main(String[] args) throws IOException {
        int port = 9000;
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        
        // User endpoints
        server.createContext("/api/java/register", new RegisterHandler());
        server.createContext("/api/java/login", new LoginHandler());
        server.createContext("/api/java/profile", new ProfileHandler());
        server.createContext("/api/java/profile/name", new UpdateNameHandler());
        server.createContext("/api/java/profile/password", new PasswordHandler());
        server.createContext("/api/java/profile/currency", new CurrencyHandler());
        server.createContext("/api/java/savings/add", new AddToSavingsHandler());
        server.createContext("/api/java/savings/withdraw", new WithdrawFromSavingsHandler());
        
        // Transaction endpoints
        server.createContext("/api/java/transactions/add", new AddTransactionHandler());
        server.createContext("/api/java/transactions/get", new GetTransactionsHandler());
        server.createContext("/api/java/transactions/delete", new DeleteTransactionHandler());
        
        // Report endpoints
        server.createContext("/api/java/report", new ReportHandler());
        server.createContext("/api/java/currency/rates", new RatesHandler());
        
        // Budget endpoints
        server.createContext("/api/java/budgets/set", new SetBudgetHandler());
        server.createContext("/api/java/budgets/get", new GetBudgetsHandler());
        server.createContext("/api/java/budgets/status", new BudgetStatusHandler());
        server.createContext("/api/java/budgets/delete", new DeleteBudgetHandler());
        
        // Goal endpoints
        server.createContext("/api/java/goals/create", new CreateGoalHandler());
        server.createContext("/api/java/goals/get", new GetGoalsHandler());
        server.createContext("/api/java/goals/contribute", new ContributeToGoalHandler());
        server.createContext("/api/java/goals/delete", new DeleteGoalHandler());
        
        // Health check
        server.createContext("/api/java/health", exchange -> {
            sendResponse(exchange, 200, "{\"status\":\"healthy\",\"service\":\"Java Backend\"}");
        });
        
        server.setExecutor(null);
        server.start();
        
        System.out.println("╔════════════════════════════════════════╗");
        System.out.println("║   Java Backend Server Started          ║");
        System.out.println("║   Port: " + port + "                            ║");
        System.out.println("║   Status: Running ✓                    ║");
        System.out.println("╚════════════════════════════════════════╝");
    }
    
    static class RegisterHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equals(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }
            
            try {
                JsonObject json = readJsonBody(exchange);
                String username = json.get("username").getAsString();
                String email = json.get("email").getAsString();
                String fullName = json.get("fullName").getAsString();
                String password = json.get("password").getAsString();
                String currency = json.has("currency") ? json.get("currency").getAsString() : "PKR";
                
                User user = userService.registerUser(username, email, fullName, password, currency);
                
                JsonObject response = new JsonObject();
                response.addProperty("message", "User registered successfully");
                response.addProperty("username", user.getUsername());
                
                sendResponse(exchange, 200, gson.toJson(response));
            } catch (Exception e) {
                sendErrorResponse(exchange, 400, e.getMessage());
            }
        }
    }
    
    static class LoginHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equals(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }
            
            try {
                JsonObject json = readJsonBody(exchange);
                String username = json.get("username").getAsString();
                String password = json.get("password").getAsString();
                
                User user = userService.loginUser(username, password);
                
                JsonObject response = new JsonObject();
                response.addProperty("message", "Login successful");
                response.addProperty("username", user.getUsername());
                response.addProperty("email", user.getEmail());
                response.addProperty("fullName", user.getFullName());
                response.addProperty("currency", user.getCurrency());
                
                sendResponse(exchange, 200, gson.toJson(response));
            } catch (Exception e) {
                sendErrorResponse(exchange, 401, e.getMessage());
            }
        }
    }
    
    static class ProfileHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (!"GET".equals(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }
            
            try {
                String query = exchange.getRequestURI().getQuery();
                String username = extractQueryParam(query, "username");
                
                User user = userService.getUser(username);
                
                JsonObject response = new JsonObject();
                response.addProperty("username", user.getUsername());
                response.addProperty("email", user.getEmail());
                response.addProperty("fullName", user.getFullName());
                response.addProperty("currency", user.getCurrency());
                response.addProperty("savingsVault", user.getSavingsVault());
                response.addProperty("createdAt", user.getCreatedAt());
                
                sendResponse(exchange, 200, gson.toJson(response));
            } catch (Exception e) {
                sendErrorResponse(exchange, 404, e.getMessage());
            }
        }
    }
    
    static class UpdateNameHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (!"PUT".equals(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }
            
            try {
                JsonObject json = readJsonBody(exchange);
                String username = json.get("username").getAsString();
                String newName = json.get("fullName").getAsString();
                
                User user = userService.updateUserName(username, newName);
                
                JsonObject response = new JsonObject();
                response.addProperty("message", "Name updated successfully");
                response.addProperty("fullName", user.getFullName());
                
                sendResponse(exchange, 200, gson.toJson(response));
            } catch (Exception e) {
                sendErrorResponse(exchange, 400, e.getMessage());
            }
        }
    }
    
    static class PasswordHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (!"PUT".equals(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }
            
            try {
                JsonObject json = readJsonBody(exchange);
                String username = json.get("username").getAsString();
                String oldPassword = json.get("oldPassword").getAsString();
                String newPassword = json.get("newPassword").getAsString();
                
                userService.resetPassword(username, oldPassword, newPassword);
                
                JsonObject response = new JsonObject();
                response.addProperty("message", "Password updated successfully");
                
                sendResponse(exchange, 200, gson.toJson(response));
            } catch (Exception e) {
                sendErrorResponse(exchange, 400, e.getMessage());
            }
        }
    }
    
    static class CurrencyHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (!"PUT".equals(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }
            
            try {
                JsonObject json = readJsonBody(exchange);
                String username = json.get("username").getAsString();
                String currency = json.get("currency").getAsString();
                
                User user = userService.updateCurrency(username, currency);
                
                JsonObject response = new JsonObject();
                response.addProperty("message", "Currency updated successfully");
                response.addProperty("currency", user.getCurrency());
                
                sendResponse(exchange, 200, gson.toJson(response));
            } catch (Exception e) {
                sendErrorResponse(exchange, 400, e.getMessage());
            }
        }
    }
    
    static class AddTransactionHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equals(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }
            
            try {
                JsonObject json = readJsonBody(exchange);
                String username = json.get("username").getAsString();
                String type = json.get("type").getAsString();
                String category = json.get("category").getAsString();
                double amount = json.get("amount").getAsDouble();
                String currency = json.has("currency") ? json.get("currency").getAsString() : "PKR";
                String description = json.get("description").getAsString();
                String date = json.get("date").getAsString();
                
                Transaction transaction = transactionService.addTransaction(
                    username, type, category, amount, currency, description, date
                );
                
                sendResponse(exchange, 200, gson.toJson(transaction));
            } catch (Exception e) {
                sendErrorResponse(exchange, 400, e.getMessage());
            }
        }
    }
    
    static class GetTransactionsHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (!"GET".equals(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }
            
            try {
                String query = exchange.getRequestURI().getQuery();
                String username = extractQueryParam(query, "username");
                
                List<Transaction> transactions = transactionService.getUserTransactions(username);
                
                sendResponse(exchange, 200, gson.toJson(transactions));
            } catch (Exception e) {
                sendErrorResponse(exchange, 404, e.getMessage());
            }
        }
    }
    
    static class DeleteTransactionHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (!"DELETE".equals(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }
            
            try {
                String query = exchange.getRequestURI().getQuery();
                String id = extractQueryParam(query, "id");
                
                boolean deleted = transactionService.deleteTransaction(id);
                
                if (deleted) {
                    JsonObject response = new JsonObject();
                    response.addProperty("message", "Transaction deleted successfully");
                    sendResponse(exchange, 200, gson.toJson(response));
                } else {
                    sendErrorResponse(exchange, 404, "Transaction not found");
                }
            } catch (Exception e) {
                sendErrorResponse(exchange, 400, e.getMessage());
            }
        }
    }
    
    static class ReportHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (!"GET".equals(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }
            
            try {
                String query = exchange.getRequestURI().getQuery();
                String username = extractQueryParam(query, "username");
                String month = extractQueryParam(query, "month");
                
                MonthlyReport report = transactionService.getMonthlyReport(username, month);
                
                sendResponse(exchange, 200, gson.toJson(report));
            } catch (Exception e) {
                sendErrorResponse(exchange, 404, e.getMessage());
            }
        }
    }
    
    static class RatesHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (!"GET".equals(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }
            
            try {
                Map<String, Double> rates = CurrencyConverter.getAllRates();
                
                JsonObject response = new JsonObject();
                JsonObject ratesObj = new JsonObject();
                for (Map.Entry<String, Double> entry : rates.entrySet()) {
                    ratesObj.addProperty(entry.getKey(), entry.getValue());
                }
                response.add("rates", ratesObj);
                
                sendResponse(exchange, 200, gson.toJson(response));
            } catch (Exception e) {
                sendErrorResponse(exchange, 500, e.getMessage());
            }
        }
    }
    
    static class AddToSavingsHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equals(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }
            
            try {
                JsonObject json = readJsonBody(exchange);
                String username = json.get("username").getAsString();
                double amount = json.get("amount").getAsDouble();
                
                User user = userService.addToSavingsVault(username, amount);
                
                JsonObject response = new JsonObject();
                response.addProperty("message", "Added to savings vault successfully");
                response.addProperty("savingsVault", user.getSavingsVault());
                
                sendResponse(exchange, 200, gson.toJson(response));
            } catch (Exception e) {
                sendErrorResponse(exchange, 400, e.getMessage());
            }
        }
    }
    
    static class WithdrawFromSavingsHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equals(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }

            try {
                JsonObject json = readJsonBody(exchange);
                String username = json.get("username").getAsString();
                double amount = json.get("amount").getAsDouble();

                User user = userService.withdrawFromSavingsVault(username, amount);

                JsonObject response = new JsonObject();
                response.addProperty("message", "Withdrawn from savings vault successfully");
                response.addProperty("savingsVault", user.getSavingsVault());

                sendResponse(exchange, 200, gson.toJson(response));
            } catch (Exception e) {
                sendErrorResponse(exchange, 400, e.getMessage());
            }
        }
    }

    // Budget Handlers
    static class SetBudgetHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equals(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }

            try {
                JsonObject json = readJsonBody(exchange);
                Budget budget = new Budget();
                budget.setUsername(json.get("username").getAsString());
                budget.setCategory(json.get("category").getAsString());
                budget.setAmount(json.get("amount").getAsDouble());
                budget.setMonth(json.get("month").getAsString());
                budget.setCurrency(json.has("currency") ? json.get("currency").getAsString() : "PKR");

                Budget created = budgetService.createBudget(budget);

                JsonObject response = new JsonObject();
                response.addProperty("message", "Budget set successfully");
                response.addProperty("id", created.getId());

                sendResponse(exchange, 200, gson.toJson(response));
            } catch (Exception e) {
                sendErrorResponse(exchange, 400, e.getMessage());
            }
        }
    }

    static class GetBudgetsHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (!"GET".equals(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }

            try {
                String query = exchange.getRequestURI().getQuery();
                String username = extractQueryParam(query, "username");
                String month = extractQueryParam(query, "month");

                List<Budget> budgets = budgetService.getUserBudgets(username, month);
                sendResponse(exchange, 200, gson.toJson(budgets));
            } catch (Exception e) {
                sendErrorResponse(exchange, 500, e.getMessage());
            }
        }
    }

    static class BudgetStatusHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (!"GET".equals(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }

            try {
                String query = exchange.getRequestURI().getQuery();
                String username = extractQueryParam(query, "username");
                String month = extractQueryParam(query, "month");

                if (month == null) {
                    month = java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM"));
                }

                List<Transaction> transactions = transactionService.getUserTransactions(username);
                Map<String, Object> status = budgetService.getBudgetStatus(username, month, transactions);

                sendResponse(exchange, 200, gson.toJson(status));
            } catch (Exception e) {
                sendErrorResponse(exchange, 500, e.getMessage());
            }
        }
    }

    static class DeleteBudgetHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (!"DELETE".equals(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }

            try {
                String query = exchange.getRequestURI().getQuery();
                String id = extractQueryParam(query, "id");

                boolean deleted = budgetService.deleteBudget(id);

                JsonObject response = new JsonObject();
                response.addProperty("message", deleted ? "Budget deleted successfully" : "Budget not found");

                sendResponse(exchange, deleted ? 200 : 404, gson.toJson(response));
            } catch (Exception e) {
                sendErrorResponse(exchange, 500, e.getMessage());
            }
        }
    }

    // Goal Handlers
    static class CreateGoalHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equals(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }

            try {
                JsonObject json = readJsonBody(exchange);
                Goal goal = new Goal();
                goal.setUsername(json.get("username").getAsString());
                goal.setName(json.get("name").getAsString());
                goal.setTargetAmount(json.get("target_amount").getAsDouble());
                goal.setDeadline(json.get("deadline").getAsString());
                goal.setCategory(json.has("category") ? json.get("category").getAsString() : "Savings");
                goal.setCurrency(json.has("currency") ? json.get("currency").getAsString() : "PKR");

                Goal created = goalService.createGoal(goal);

                JsonObject response = new JsonObject();
                response.addProperty("message", "Goal created successfully");
                response.addProperty("id", created.getId());

                sendResponse(exchange, 200, gson.toJson(response));
            } catch (Exception e) {
                sendErrorResponse(exchange, 400, e.getMessage());
            }
        }
    }

    static class GetGoalsHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (!"GET".equals(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }

            try {
                String query = exchange.getRequestURI().getQuery();
                String username = extractQueryParam(query, "username");

                List<Map<String, Object>> goals = goalService.getUserGoals(username);
                sendResponse(exchange, 200, gson.toJson(goals));
            } catch (Exception e) {
                sendErrorResponse(exchange, 500, e.getMessage());
            }
        }
    }

    static class ContributeToGoalHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equals(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }

            try {
                JsonObject json = readJsonBody(exchange);
                String id = json.get("id").getAsString();
                double amount = json.get("amount").getAsDouble();

                Goal goal = goalService.contributeToGoal(id, amount);

                if (goal == null) {
                    sendErrorResponse(exchange, 404, "Goal not found");
                    return;
                }

                JsonObject response = new JsonObject();
                response.addProperty("message", "Contribution added successfully");
                response.addProperty("current_amount", goal.getCurrentAmount());
                response.addProperty("status", goal.getStatus());

                sendResponse(exchange, 200, gson.toJson(response));
            } catch (Exception e) {
                sendErrorResponse(exchange, 400, e.getMessage());
            }
        }
    }

    static class DeleteGoalHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (!"DELETE".equals(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }

            try {
                String query = exchange.getRequestURI().getQuery();
                String id = extractQueryParam(query, "id");

                boolean deleted = goalService.deleteGoal(id);

                JsonObject response = new JsonObject();
                response.addProperty("message", deleted ? "Goal deleted successfully" : "Goal not found");

                sendResponse(exchange, deleted ? 200 : 404, gson.toJson(response));
            } catch (Exception e) {
                sendErrorResponse(exchange, 500, e.getMessage());
            }
        }
    }
    
    private static JsonObject readJsonBody(HttpExchange exchange) throws IOException {
        InputStreamReader isr = new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8);
        return JsonParser.parseReader(isr).getAsJsonObject();
    }
    
    private static String extractQueryParam(String query, String param) {
        if (query == null) return null;
        String[] pairs = query.split("&");
        for (String pair : pairs) {
            String[] keyValue = pair.split("=");
            if (keyValue.length == 2 && keyValue[0].equals(param)) {
                return keyValue[1];
            }
        }
        return null;
    }
    
    private static void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        exchange.getResponseHeaders().add("Content-Type", "application/json");
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
        
        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        OutputStream os = exchange.getResponseBody();
        os.write(bytes);
        os.close();
    }
    
    private static void sendErrorResponse(HttpExchange exchange, int statusCode, String message) throws IOException {
        JsonObject error = new JsonObject();
        error.addProperty("error", message);
        sendResponse(exchange, statusCode, gson.toJson(error));
    }
}
