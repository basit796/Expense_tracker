"""
Firebase Data Migration Script
Migrates JSON data to Firestore with UUID-based schema
"""
import json
import firebase_admin
from firebase_admin import credentials, firestore
from pathlib import Path
from datetime import datetime
import uuid

# Initialize Firebase Admin SDK
cred = credentials.Certificate('serviceAccountKey.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

# Store username -> userId mapping for transactions migration
username_to_userid = {}

def migrate_users():
    """Migrate users from JSON to Firestore with UUID"""
    users_file = Path('java-backend/data/users.json')
    if not users_file.exists():
        print("❌ Users file not found")
        return
    
    users = json.loads(users_file.read_text())
    print(f"📤 Migrating {len(users)} users...")
    
    for user in users:
        # Generate UUID for user
        user_id = str(uuid.uuid4())
        username = user['username']
        
        # Store in users collection with UUID as document ID
        user_ref = db.collection('users').document(user_id)
        user_ref.set({
            'userId': user_id,
            'username': username,
            'email': user.get('email', ''),
            'password': user.get('password', ''),
            'fullName': user.get('fullName', ''),
            'currency': user.get('currency', 'PKR'),
            'savingsVault': user.get('savingsVault', 0),
            'createdAt': firestore.SERVER_TIMESTAMP
        })
        
        # Store username -> userId mapping for quick lookups
        username_ref = db.collection('usernames').document(username)
        username_ref.set({
            'userId': user_id,
            'username': username
        })
        
        # Save mapping for transaction migration
        username_to_userid[username] = user_id
        
        print(f"  ✅ Migrated user: {username} → {user_id}")
    
    print(f"✅ Successfully migrated {len(users)} users\n")

def migrate_transactions():
    """Migrate transactions from JSON to Firestore with userId"""
    transactions_file = Path('java-backend/data/transactions.json')
    if not transactions_file.exists():
        print("❌ Transactions file not found")
        return
    
    transactions = json.loads(transactions_file.read_text())
    print(f"📤 Migrating {len(transactions)} transactions...")
    
    for txn in transactions:
        username = txn.get('username', '')
        user_id = username_to_userid.get(username)
        
        if not user_id:
            print(f"  ⚠️  Skipping transaction - user not found: {username}")
            continue
        
        txn_id = txn.get('id', str(uuid.uuid4()))
        txn_ref = db.collection('transactions').document(txn_id)
        txn_ref.set({
            'transactionId': txn_id,
            'userId': user_id,
            'username': username,  # Keep for display purposes
            'type': txn.get('type', ''),
            'category': txn.get('category', ''),
            'amount': float(txn.get('amount', 0)),
            'description': txn.get('description', ''),
            'date': txn.get('date', ''),
            'currency': txn.get('currency', 'PKR'),
            'createdAt': txn.get('created_at', datetime.now().isoformat())
        })
    
    print(f"✅ Successfully migrated {len(transactions)} transactions\n")

def migrate_budgets():
    """Migrate budgets from JSON to Firestore with userId"""
    budgets_file = Path('java-backend/data/budgets.json')
    if not budgets_file.exists():
        print("⚠️  Budgets file not found (skipping)")
        return
    
    budgets = json.loads(budgets_file.read_text())
    print(f"📤 Migrating {len(budgets)} budgets...")
    
    for budget in budgets:
        username = budget.get('username', '')
        user_id = username_to_userid.get(username)
        
        if not user_id:
            print(f"  ⚠️  Skipping budget - user not found: {username}")
            continue
        
        budget_id = budget.get('id', str(uuid.uuid4()))
        budget_ref = db.collection('budgets').document(budget_id)
        budget_ref.set({
            'budgetId': budget_id,
            'userId': user_id,
            'username': username,  # Keep for display
            'category': budget.get('category', ''),
            'amount': float(budget.get('amount', 0)),
            'month': budget.get('month', ''),
            'currency': budget.get('currency', 'PKR'),
            'createdAt': firestore.SERVER_TIMESTAMP
        })
    
    print(f"✅ Successfully migrated {len(budgets)} budgets\n")

def migrate_goals():
    """Migrate financial goals from JSON to Firestore with userId"""
    goals_file = Path('java-backend/data/goals.json')
    if not goals_file.exists():
        print("⚠️  Goals file not found (skipping)")
        return
    
    goals = json.loads(goals_file.read_text())
    print(f"📤 Migrating {len(goals)} goals...")
    
    for goal in goals:
        username = goal.get('username', '')
        user_id = username_to_userid.get(username)
        
        if not user_id:
            print(f"  ⚠️  Skipping goal - user not found: {username}")
            continue
        
        goal_id = goal.get('id', str(uuid.uuid4()))
        goal_ref = db.collection('goals').document(goal_id)
        goal_ref.set({
            'goalId': goal_id,
            'userId': user_id,
            'username': username,  # Keep for display
            'name': goal.get('name', ''),
            'target_amount': float(goal.get('target_amount', 0)),
            'current_amount': float(goal.get('current_amount', 0)),
            'deadline': goal.get('deadline', ''),
            'currency': goal.get('currency', 'PKR'),
            'createdAt': firestore.SERVER_TIMESTAMP
        })
    
    print(f"✅ Successfully migrated {len(goals)} goals\n")

def migrate_currency_rates():
    """Migrate currency rates from JSON to Firestore"""
    rates_file = Path('java-backend/data/currency_rates.json')
    if not rates_file.exists():
        print("⚠️  Currency rates file not found (skipping)")
        return
    
    rates_data = json.loads(rates_file.read_text())
    print(f"📤 Migrating currency rates...")
    
    rates_ref = db.collection('currency_rates').document('rates')
    rates_ref.set(rates_data.get('rates', {}))
    
    print(f"✅ Successfully migrated currency rates\n")

def main():
    """Run all migrations"""
    print("🔥 Starting Firebase Data Migration\n")
    print("="*50)
    
    try:
        migrate_users()
        migrate_transactions()
        migrate_budgets()
        migrate_goals()
        migrate_currency_rates()
        
        print("="*50)
        print("🎉 Migration completed successfully!")
        print("\n📊 Summary:")
        print(f"  • Users: ✅")
        print(f"  • Transactions: ✅")
        print(f"  • Budgets: ✅")
        print(f"  • Goals: ✅")
        print(f"  • Currency Rates: ✅")
        
    except Exception as e:
        print(f"\n❌ Migration failed: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
