from firebase_admin import firestore
from datetime import datetime, timedelta
from typing import Dict, List

db = firestore.client()

async def update_analytics_counters(event_type: str, data: Dict = None):
    """Update various analytics counters based on events"""
    try:
        today = datetime.now().strftime('%Y-%m-%d')
        analytics_ref = db.collection('analytics').document('daily')
        
        if event_type == "new_user":
            analytics_ref.set({
                today: {
                    'newUsers': firestore.Increment(1),
                    'totalUsers': firestore.Increment(1)
                }
            }, merge=True)
        
        elif event_type == "search":
            category = data.get('category', 'unknown')
            analytics_ref.set({
                today: {
                    'totalSearches': firestore.Increment(1),
                    f'searchesByCategory.{category}': firestore.Increment(1)
                }
            }, merge=True)
        
        elif event_type == "api_call":
            analytics_ref.set({
                today: {
                    'apiCalls': firestore.Increment(1)
                }
            }, merge=True)

async def get_analytics_report(days: int = 7):
    """Get detailed analytics report for specified number of days"""
    try:
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        # Get daily analytics
        analytics_ref = db.collection('analytics').document('daily')
        daily_stats = analytics_ref.get().to_dict() or {}
        
        # Get user statistics
        users_ref = db.collection('users')
        total_users = len(list(users_ref.stream()))
        
        # Get category statistics
        categories_ref = db.collection('categories')
        category_stats = {}
        for cat in categories_ref.stream():
            cat_data = cat.to_dict()
            category_stats[cat.id] = {
                'name': cat_data.get('name'),
                'totalProviders': cat_data.get('totalProviders', 0),
                'avgRating': cat_data.get('avgRating', 0)
            }
        
        # Get activity logs
        activities = db.collection('activityLogs')\
            .where('timestamp', '>=', start_date)\
            .order_by('timestamp', direction=firestore.Query.DESCENDING)\
            .limit(100)\
            .stream()
        
        recent_activities = [{'id': act.id, **act.to_dict()} for act in activities]
        
        return {
            'userStats': {
                'total': total_users,
                'newUsers': sum(day.get('newUsers', 0) for day in daily_stats.values())
            },
            'searchStats': {
                'total': sum(day.get('totalSearches', 0) for day in daily_stats.values()),
                'byCategory': {k: sum(day.get(f'searchesByCategory.{k}', 0) for day in daily_stats.values()) 
                             for k in category_stats.keys()}
            },
            'categoryStats': category_stats,
            'apiUsage': {
                'total': sum(day.get('apiCalls', 0) for day in daily_stats.values()),
                'daily': {date: stats.get('apiCalls', 0) for date, stats in daily_stats.items()}
            },
            'recentActivities': recent_activities
        }

async def get_category_performance(category_id: str, days: int = 30):
    """Get detailed performance metrics for a specific category"""
    try:
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        # Get category base info
        cat_ref = db.collection('categories').document(category_id)
        cat_data = cat_ref.get().to_dict()
        
        # Get searches for this category
        searches = db.collection('activityLogs')\
            .where('type', '==', 'search')\
            .where('details.category', '==', category_id)\
            .where('timestamp', '>=', start_date)\
            .stream()
        
        search_count = len(list(searches))
        
        # Get saved businesses in this category
        saved = db.collection('savedBusinesses')\
            .where('businessInfo.category', '==', category_id)\
            .where('savedAt', '>=', start_date)\
            .stream()
        
        saved_count = len(list(saved))
        
        return {
            'categoryInfo': cat_data,
            'metrics': {
                'totalSearches': search_count,
                'savedBusinesses': saved_count,
                'conversionRate': (saved_count / search_count) if search_count > 0 else 0
            }
        }

async def cleanup_old_logs(days_to_keep: int = 90):
    """Cleanup old activity logs to maintain database performance"""
    try:
        cutoff_date = datetime.now() - timedelta(days=days_to_keep)
        old_logs = db.collection('activityLogs')\
            .where('timestamp', '<', cutoff_date)\
            .stream()
        
        batch = db.batch()
        for log in old_logs:
            batch.delete(log.reference)
        
        batch.commit()
        return {"status": "success", "message": f"Cleaned up logs older than {days_to_keep} days"}
    except Exception as e:
        raise Exception(f"Error cleaning up logs: {str(e)}")
