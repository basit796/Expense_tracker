"""
Reset passwords for migrated users
This sets known passwords so you can login
"""
import firebase_admin
from firebase_admin import credentials, firestore
import hashlib

try:
    cred = credentials.Certificate('serviceAccountKey.json')
    firebase_admin.initialize_app(cred)
except:
    pass

db = firestore.client()

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

print("\n" + "=" * 60)
print("PASSWORD RESET FOR MIGRATED USERS")
print("=" * 60)

# Map of username to new password
reset_users = {
    'testuser': '123456',  # Simple password
    'demo': '123456',
    'ayankyt9': '123456',
    'wahab': '123456'
}

print("\nResetting passwords to: 123456")
print("\nUpdating users...")

for username, new_password in reset_users.items():
    # Get userId from username
    username_ref = db.collection('usernames').document(username).get()
    
    if username_ref.exists:
        user_id = username_ref.to_dict()['userId']
        hashed_pwd = hash_password(new_password)
        
        # Update password in Firestore
        db.collection('users').document(user_id).update({
            'password': hashed_pwd
        })
        
        print(f"✅ {username:12} → Password reset to: {new_password}")
    else:
        print(f"❌ {username:12} → User not found")

print("\n" + "=" * 60)
print("✅ DONE!")
print("\nYou can now login with:")
print("\n  Username: testuser  | Password: 123456")
print("  Username: demo      | Password: 123456")
print("  Username: ayankyt9  | Password: 123456")
print("  Username: wahab     | Password: 123456")
print("\n" + "=" * 60 + "\n")
