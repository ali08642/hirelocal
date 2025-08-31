from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
from datetime import datetime
from .models import UserProfile, BusinessData, CategoryCreate, ActivityLog, SearchQuery
from .firebase_admin import (
    verify_firebase_token,
    get_user_profile,
    update_user_profile,
    save_business,
    get_saved_businesses
)
from .utils.analytics import (
    update_analytics_counters,
    get_analytics_report,
    get_category_performance,
    cleanup_old_logs
)

router = APIRouter(prefix="/api/v1")

# Enhanced Admin Analytics Endpoints
@router.get("/admin/analytics/report")
async def get_admin_report(
    days: int = Query(7, ge=1, le=90),
    token=Depends(verify_token)
):
    """
    Get detailed analytics report
    - User statistics
    - Search patterns
    - Category performance
    - API usage
    - Recent activities
    """
    # Add admin check here
    try:
        report = await get_analytics_report(days)
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/admin/categories/{category_id}/performance")
async def get_category_metrics(
    category_id: str,
    days: int = Query(30, ge=1, le=90),
    token=Depends(verify_token)
):
    """
    Get detailed performance metrics for a specific category
    - Search volume
    - Saved business count
    - Conversion rates
    """
    try:
        metrics = await get_category_performance(category_id, days)
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Enhanced User Management
@router.put("/users/{uid}/profile")
async def update_user_profile_enhanced(
    uid: str,
    profile: UserProfile,
    token=Depends(verify_token)
):
    """
    Update user profile with validation
    - Basic info
    - Notification preferences
    - Privacy settings
    """
    if token["uid"] != uid:
        raise HTTPException(status_code=403, detail="Not authorized")
    try:
        result = await update_user_profile(uid, profile.dict(exclude_unset=True))
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Enhanced Business Management
@router.post("/businesses/batch-save")
async def batch_save_businesses(
    businesses: List[BusinessData],
    token=Depends(verify_token)
):
    """
    Save multiple businesses at once
    - Validates each business data
    - Updates analytics
    - Returns saved IDs
    """
    try:
        saved_ids = []
        for business in businesses:
            result = await save_business(token["uid"], business.dict())
            saved_ids.append(result["id"])
        await update_analytics_counters("business_save", {"count": len(businesses)})
        return {"saved_ids": saved_ids}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Search and Category Management
@router.post("/search/log")
async def log_search_query(
    query: SearchQuery,
    token=Depends(verify_token)
):
    """
    Log search query and update analytics
    - Records search parameters
    - Updates category metrics
    - Returns search ID
    """
    try:
        await update_analytics_counters("search", query.dict())
        return {"status": "logged"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Maintenance Endpoints
@router.post("/admin/maintenance/cleanup-logs")
async def trigger_log_cleanup(
    days_to_keep: int = Query(90, ge=30, le=365),
    token=Depends(verify_token)
):
    """
    Cleanup old activity logs
    - Removes logs older than specified days
    - Updates analytics
    """
    # Add admin check here
    try:
        result = await cleanup_old_logs(days_to_keep)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
