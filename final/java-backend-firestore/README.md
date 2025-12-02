# Java Backend with Firestore - UUID Support

## Purpose
This is a **future-ready** Java backend with Firestore database support.

## Status
✅ Created for future use
✅ UUID-based user system
✅ Firestore integration
⚠️ Not currently used (Python version deployed)

## When to Use This
- If you want to switch to Java backend later
- For learning Java + Firebase integration
- For portfolio (shows Java + cloud database skills)

## How to Run

### 1. Prerequisites
- Java 17+
- Maven
- serviceAccountKey.json in parent folder

### 2. Build
```bash
mvn clean package
```

### 3. Run
```bash
java -jar target/expense-tracker-firestore-3.0.0.jar
```

### 4. Test
```bash
curl http://localhost:9000/api/health
```

## Features
✅ User registration/login (UUID-based)
✅ Transactions CRUD
✅ Budgets management
✅ Financial goals
✅ Savings vault
✅ Direct Firestore access
✅ No JSON files needed

## Differences from Original Java Backend
- Uses Firestore (cloud) instead of JSON (local files)
- UUID-based user IDs
- Can be deployed to cloud
- Matches Python backend functionality

## Production Use
Currently, Python backend (`main_firestore_uuid.py`) is deployed.
This Java version is available if you want to switch later.
