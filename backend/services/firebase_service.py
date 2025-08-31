from firebase_admin import credentials, initialize_app, auth, firestore
import os
from pathlib import Path

class FirebaseService:
    def __init__(self):
        # Initialize Firebase Admin
        cred = credentials.Certificate(
            Path(__file__).parent / "firebase-service-account.json"
        )
        self.app = initialize_app(cred)
        self.db = firestore.client()

    def verify_firebase_token(self, id_token: str):
        try:
            decoded_token = auth.verify_id_token(id_token)
            return decoded_token
        except Exception as e:
            raise Exception(f"Invalid token: {str(e)}")

    # User Management
    async def get_user_profile(self, uid: str):
        try:
            doc_ref = self.db.collection('users').document(uid)
            doc = doc_ref.get()
            return doc.to_dict() if doc.exists else None
        except Exception as e:
            raise Exception(f"Error fetching user: {str(e)}")

    async def update_user_profile(self, uid: str, data: dict):
        try:
            doc_ref = self.db.collection('users').document(uid)
            doc_ref.set(data, merge=True)
            return {"status": "success", "message": "Profile updated"}
        except Exception as e:
            raise Exception(f"Error updating user: {str(e)}")

    # Category Management
    async def get_categories(self):
        try:
            categories = self.db.collection('categories').stream()
            return [{"id": cat.id, **cat.to_dict()} for cat in categories]
        except Exception as e:
            raise Exception(f"Error fetching categories: {str(e)}")

    # Business Management
    async def save_business(self, uid: str, business_data: dict):
        try:
            doc_ref = self.db.collection('savedBusinesses').document()
            data = {
                "userId": uid,
                "businessInfo": business_data,
                "savedAt": firestore.SERVER_TIMESTAMP
            }
            doc_ref.set(data)
            return {"id": doc_ref.id, **data}
        except Exception as e:
            raise Exception(f"Error saving business: {str(e)}")

    async def get_saved_businesses(self, uid: str):
        try:
            businesses = self.db.collection('savedBusinesses').where("userId", "==", uid).stream()
            return [{"id": bus.id, **bus.to_dict()} for bus in businesses]
        except Exception as e:
            raise Exception(f"Error fetching saved businesses: {str(e)}")

# Create a singleton instance
firebase_service = FirebaseService()
