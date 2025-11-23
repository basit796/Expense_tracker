package com.expensetracker.utils;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import java.io.*;
import java.lang.reflect.Type;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;

public class JsonFileHandler {
    
    private static final Gson gson = new GsonBuilder().setPrettyPrinting().create();
    private static final String DATA_DIR = "data/";
    
    public static <T> List<T> readList(String filename, Class<T> clazz) {
        try {
            File file = new File(DATA_DIR + filename);
            if (!file.exists()) {
                return new ArrayList<>();
            }
            
            String content = new String(Files.readAllBytes(file.toPath()));
            if (content.trim().isEmpty()) {
                return new ArrayList<>();
            }
            
            Type listType = TypeToken.getParameterized(List.class, clazz).getType();
            List<T> list = gson.fromJson(content, listType);
            return list != null ? list : new ArrayList<>();
            
        } catch (IOException e) {
            throw new RuntimeException("Error reading file: " + filename, e);
        }
    }
    
    public static <T> void writeList(String filename, List<T> data) {
        try {
            File dir = new File(DATA_DIR);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            
            File file = new File(DATA_DIR + filename);
            String json = gson.toJson(data);
            Files.write(file.toPath(), json.getBytes());
            
        } catch (IOException e) {
            throw new RuntimeException("Error writing file: " + filename, e);
        }
    }
    
    public static String readJsonObject(String filename) {
        try {
            File file = new File(DATA_DIR + filename);
            if (!file.exists()) {
                return "{}";
            }
            return new String(Files.readAllBytes(file.toPath()));
        } catch (IOException e) {
            throw new RuntimeException("Error reading file: " + filename, e);
        }
    }
    
    public static void writeJsonObject(String filename, String jsonContent) {
        try {
            File dir = new File(DATA_DIR);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            
            File file = new File(DATA_DIR + filename);
            Files.write(file.toPath(), jsonContent.getBytes());
            
        } catch (IOException e) {
            throw new RuntimeException("Error writing file: " + filename, e);
        }
    }
}
