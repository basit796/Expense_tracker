package com.expensetracker.utils;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import java.util.HashMap;
import java.util.Map;

public class CurrencyConverter {
    
    private static Map<String, Double> rates;
    private static final Gson gson = new Gson();
    
    static {
        loadRates();
    }
    
    private static void loadRates() {
        try {
            String jsonContent = JsonFileHandler.readJsonObject("currency_rates.json");
            JsonObject obj = gson.fromJson(jsonContent, JsonObject.class);
            JsonObject ratesObj = obj.getAsJsonObject("rates");
            
            rates = new HashMap<>();
            for (String currency : ratesObj.keySet()) {
                rates.put(currency, ratesObj.get(currency).getAsDouble());
            }
        } catch (Exception e) {
            // Default rates if file doesn't exist
            rates = new HashMap<>();
            rates.put("PKR", 1.0);
            rates.put("USD", 280.5);
            rates.put("EUR", 305.2);
            rates.put("GBP", 355.8);
            rates.put("SAR", 74.8);
            rates.put("AED", 76.4);
        }
    }
    
    public static double convertToPKR(double amount, String fromCurrency) {
        if (fromCurrency == null || fromCurrency.equals("PKR")) {
            return amount;
        }
        
        Double rate = rates.get(fromCurrency.toUpperCase());
        if (rate == null) {
            throw new IllegalArgumentException("Unsupported currency: " + fromCurrency);
        }
        
        return amount * rate;
    }
    
    public static double convertFromPKR(double pkrAmount, String toCurrency) {
        if (toCurrency == null || toCurrency.equals("PKR")) {
            return pkrAmount;
        }
        
        Double rate = rates.get(toCurrency.toUpperCase());
        if (rate == null) {
            throw new IllegalArgumentException("Unsupported currency: " + toCurrency);
        }
        
        return pkrAmount / rate;
    }
    
    public static Map<String, Double> getAllRates() {
        return new HashMap<>(rates);
    }
    
    public static double convert(double amount, String fromCurrency, String toCurrency) {
        if (fromCurrency.equals(toCurrency)) {
            return amount;
        }
        
        // Convert from source to PKR first
        double pkrAmount = convertToPKR(amount, fromCurrency);
        
        // Then convert from PKR to target currency
        return convertFromPKR(pkrAmount, toCurrency);
    }
    
    public static void updateRates(Map<String, Double> newRates) {
        rates.putAll(newRates);
        
        // Save to file
        JsonObject obj = new JsonObject();
        JsonObject ratesObj = new JsonObject();
        for (Map.Entry<String, Double> entry : rates.entrySet()) {
            ratesObj.addProperty(entry.getKey(), entry.getValue());
        }
        obj.add("rates", ratesObj);
        
        JsonFileHandler.writeJsonObject("currency_rates.json", gson.toJson(obj));
    }
}
