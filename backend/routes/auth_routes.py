from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
import datetime
from firebase_admin import auth
from firebase_init import db, verify_firebase_token

router = APIRouter()

class AuthRequest(BaseModel):
    token: str  # ID token from Google/Facebook
    provider: str  # "google" or "facebook"

class UserProfile(BaseModel):
    userId: str
    name: str
    email: str
    photoURL: Optional[str] = None
    provider: str
    lastLoginAt: Optional[datetime.datetime] = None

@router.post("/auth/verify-token", response_model=UserProfile)
async def verify_auth_token(auth_request: AuthRequest):
    """Verify ID token and create/update user in Firebase"""
    headers = {
        "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
        "Cross-Origin-Embedder-Policy": "require-corp"
    }
    try:
        # Verify the ID token
        decoded_token = auth.verify_id_token(auth_request.token)
        uid = decoded_token['uid']
        
        # Get user info
        user = auth.get_user(uid)
        
        # Update or create user profile in Firestore
        user_ref = db.collection('users').document(uid)
        
        user_data = {
            'userId': uid,
            'name': user.display_name or '',
            'email': user.email or '',
            'photoURL': user.photo_url or None,
            'provider': auth_request.provider,
            'lastLoginAt': datetime.datetime.now(),
            'metadata': {
                'createdAt': user.user_metadata.creation_timestamp,
                'lastSignInAt': user.user_metadata.last_sign_in_timestamp
            }
        }
        
        # Use set with merge to update existing or create new
        user_ref.set(user_data, merge=True)
        
        # Return the user data with COOP headers
        return UserProfile(**user_data)
        user_ref.set(user_data, merge=True)
        
        return {
            'success': True,
            'user': user_data,
            'message': 'Authentication successful'
        }
        
    except auth.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Invalid authentication token")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/auth/user/{user_id}")
async def get_user_profile(user_id: str):
    """Get user profile data"""
    try:
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User not found")
            
        return {
            'success': True,
            'user': user_doc.to_dict()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/auth/user/{user_id}")
async def update_user_profile(user_id: str, profile: UserProfile):
    """Update user profile data"""
    try:
        user_ref = db.collection('users').document(user_id)
        
        if not user_ref.get().exists:
            raise HTTPException(status_code=404, detail="User not found")
            
        # Update the user profile
        user_ref.update(profile.dict(exclude_unset=True))
        
        return {
            'success': True,
            'message': 'Profile updated successfully'
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
