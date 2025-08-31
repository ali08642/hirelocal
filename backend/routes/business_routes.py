from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from firebase_admin import firestore
from ..firebase_service import get_db

router = APIRouter()

class BusinessInfo(BaseModel):
    name: str
    rating: str
    reviews: int
    phone: str
    address: str
    website: str
    category: str
    confidence: str

class SavedBusiness(BaseModel):
    userId: str
    businessInfo: BusinessInfo
    savedAt: Optional[datetime] = None
    docId: Optional[str] = None
    isSaved: Optional[bool] = None

@router.post("/businesses/check-saved")
async def check_business_saved(business: SavedBusiness):
    """Check if a business is already saved by the user"""
    try:
        db = get_db()
        query = db.collection('savedBusinesses').where('userId', '==', business.userId)
        businesses = query.get()
        
        for doc in businesses:
            data = doc.to_dict()
            saved_business = data['businessInfo']
            if (saved_business['name'].lower() == business.businessInfo.name.lower() and 
                saved_business['address'].lower() == business.businessInfo.address.lower()):
                return {
                    'exists': True,
                    'docId': doc.id,
                    'savedAt': data.get('savedAt'),
                    'message': 'Business already saved'
                }
        
        return {
            'exists': False,
            'docId': None,
            'message': 'Business not saved yet'
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/businesses/save")
async def save_business(business: SavedBusiness):
    """Save a new business for a user"""
    try:
        db = get_db()
        # First check if it exists
        check_result = await check_business_saved(business)
        
        if check_result['exists']:
            return check_result
            
        # Add new business
        doc_ref = db.collection('savedBusinesses').document()
        business_dict = business.dict()
        business_dict['docId'] = doc_ref.id
        business_dict['isSaved'] = True
        business_dict['savedAt'] = firestore.SERVER_TIMESTAMP
        
        doc_ref.set(business_dict)
        
        return {
            'success': True,
            'docId': doc_ref.id,
            'message': 'Business saved successfully'
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/businesses/{doc_id}")
async def unsave_business(doc_id: str, user_id: str):
    """Remove a saved business"""
    try:
        db = get_db()
        doc_ref = db.collection('savedBusinesses').document(doc_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Saved business not found")
            
        data = doc.to_dict()
        if data['userId'] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to remove this saved business")
            
        doc_ref.delete()
        
        return {
            'success': True,
            'message': 'Business removed from saved list'
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/businesses/saved/{user_id}")
async def get_saved_businesses(user_id: str):
    """Get all saved businesses for a user"""
    try:
        db = get_db()
        query = db.collection('savedBusinesses').where('userId', '==', user_id)
        businesses = query.get()
        
        saved_businesses = []
        for doc in businesses:
            business_data = doc.to_dict()
            business_data['docId'] = doc.id
            business_data['isSaved'] = True
            saved_businesses.append(business_data)
            
        return {
            'success': True,
            'businesses': saved_businesses
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/businesses/{doc_id}/update-category")
async def update_business_category(doc_id: str, user_id: str, new_category: str):
    """Update the category of a saved business"""
    try:
        db = get_db()
        doc_ref = db.collection('savedBusinesses').document(doc_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Saved business not found")
            
        data = doc.to_dict()
        if data['userId'] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to update this business")
            
        doc_ref.update({
            'businessInfo.category': new_category,
            'updatedAt': firestore.SERVER_TIMESTAMP
        })
        
        return {
            'success': True,
            'message': 'Business category updated successfully'
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/businesses/by-category/{user_id}/{category}")
async def get_businesses_by_category(user_id: str, category: str):
    """Get all saved businesses in a specific category for a user"""
    try:
        db = get_db()
        query = (db.collection('savedBusinesses')
                .where('userId', '==', user_id)
                .where('businessInfo.category', '==', category))
        businesses = query.get()
        
        category_businesses = []
        for doc in businesses:
            business_data = doc.to_dict()
            business_data['docId'] = doc.id
            business_data['isSaved'] = True
            category_businesses.append(business_data)
            
        return {
            'success': True,
            'businesses': category_businesses
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/businesses/batch-save")
async def batch_save_businesses(businesses: List[SavedBusiness]):
    """Batch save multiple businesses for a user"""
    try:
        db = get_db()
        batch = db.batch()
        results = []
        
        for business in businesses:
            # Check if already saved
            check_result = await check_business_saved(business)
            if check_result['exists']:
                results.append({
                    'business': business.businessInfo.name,
                    'status': 'skipped',
                    'message': 'Already saved',
                    'docId': check_result['docId']
                })
                continue
                
            # Add to batch
            doc_ref = db.collection('savedBusinesses').document()
            business_dict = business.dict()
            business_dict['docId'] = doc_ref.id
            business_dict['isSaved'] = True
            business_dict['savedAt'] = firestore.SERVER_TIMESTAMP
            
            batch.set(doc_ref, business_dict)
            results.append({
                'business': business.businessInfo.name,
                'status': 'saved',
                'message': 'Successfully saved',
                'docId': doc_ref.id
            })
            
        # Commit batch
        batch.commit()
        
        return {
            'success': True,
            'results': results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
