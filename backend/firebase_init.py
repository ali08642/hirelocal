"""Firebase initialization and utilities"""
import os
from firebase_admin import credentials, initialize_app, auth, firestore
from pathlib import Path

# Initialize Firebase Admin
def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    try:
        # Get the absolute path to the service account file
        current_dir = os.path.dirname(os.path.abspath(__file__))
        service_account_path = os.path.join(current_dir, "firebase-service-account.json")
        
        if not os.path.exists(service_account_path):
            raise FileNotFoundError(f"Service account file not found at: {service_account_path}")
            
        # Initialize Firebase Admin
        cred = credentials.Certificate(service_account_path)
        app = initialize_app(cred)
        return firestore.client()
    except Exception as e:
        print(f"Failed to initialize Firebase: {e}")
        raise

# Initialize on module import
db = initialize_firebase()

def verify_firebase_token(id_token: str):
    """Verify Firebase ID token"""
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        raise Exception(f"Invalid token: {str(e)}")

# User Management
async def get_user_profile(uid: str):
    """Get user profile from Firestore"""
    try:
        doc_ref = db.collection('users').document(uid)
        doc = doc_ref.get()
        if doc.exists:
            return doc.to_dict()
        return None
    except Exception as e:
        print(f"Error getting user profile: {e}")
        return None

async def update_user_profile(uid: str, data: dict):
    """Update user profile in Firestore"""
    try:
        doc_ref = db.collection('users').document(uid)
        doc_ref.update(data)
        return True
    except Exception as e:
        print(f"Error updating user profile: {e}")
        return False
