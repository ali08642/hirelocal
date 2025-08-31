from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, List, Optional
from firebase_admin import verify_firebase_token
from .firebase_admin import (
    get_user_profile,
    update_user_profile,
    get_categories,
    add_category,
    save_business,
    get_saved_businesses,
    log_activity,
    get_analytics
)

router = APIRouter()

# Auth Middleware
async def verify_token(authorization: str):
    try:
        token = authorization.replace("Bearer ", "")
        return verify_firebase_token(token)
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")

# Auth Routes
@router.post("/auth/verify")
async def verify_auth(authorization: str):
    try:
        decoded_token = await verify_token(authorization)
        return {"uid": decoded_token["uid"], "email": decoded_token.get("email")}
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

# User Routes
@router.get("/users/{uid}")
async def get_user(uid: str, token=Depends(verify_token)):
    try:
        user = await get_user_profile(uid)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/users/{uid}")
async def update_user(uid: str, data: Dict, token=Depends(verify_token)):
    try:
        if token["uid"] != uid:
            raise HTTPException(status_code=403, detail="Not authorized")
        result = await update_user_profile(uid, data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Category Routes
@router.get("/categories")
async def list_categories(token=Depends(verify_token)):
    try:
        categories = await get_categories()
        return categories
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/admin/categories")
async def create_category(data: Dict, token=Depends(verify_token)):
    # Add admin check here
    try:
        category = await add_category(data)
        return category
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Saved Businesses Routes
@router.post("/businesses/save")
async def save_business_for_user(business_data: Dict, token=Depends(verify_token)):
    try:
        result = await save_business(token["uid"], business_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/businesses/saved/{uid}")
async def get_user_saved_businesses(uid: str, token=Depends(verify_token)):
    try:
        if token["uid"] != uid:
            raise HTTPException(status_code=403, detail="Not authorized")
        businesses = await get_saved_businesses(uid)
        return businesses
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Analytics Routes
@router.post("/activities/log")
async def log_user_activity(activity_data: Dict, token=Depends(verify_token)):
    try:
        result = await log_activity({**activity_data, "userId": token["uid"]})
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/admin/analytics")
async def get_admin_analytics(token=Depends(verify_token)):
    # Add admin check here
    try:
        analytics = await get_analytics()
        return analytics
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
