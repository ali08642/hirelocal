from firebase_admin import credentials, initialize_app, firestore
import datetime
import os

def initialize_firebase():
    try:
        # Get the absolute path to the service account file
        current_dir = os.path.dirname(os.path.abspath(__file__))
        service_account_path = os.path.join(current_dir, "firebase-service-account.json")
        
        if not os.path.exists(service_account_path):
            raise FileNotFoundError(f"Service account file not found at: {service_account_path}")
            
        # Initialize Firebase Admin
        cred = credentials.Certificate(service_account_path)
        app = initialize_app(cred)
        db = firestore.client()
        print("✅ Firebase initialized successfully")
        return db
    except Exception as e:
        print(f"❌ Error initializing Firebase: {str(e)}")
        raise e

def setup_database(db_client):
    try:
        # Setup Categories
        categories = [
            {
                "name": "Plumber",
                "iconName": "wrench",
                "active": True,
                "totalProviders": 0,
                "avgRating": 0,
                "createdAt": firestore.SERVER_TIMESTAMP
            },
            {
                "name": "Electrician",
                "iconName": "zap",
                "active": True,
                "totalProviders": 0,
                "avgRating": 0,
                "createdAt": firestore.SERVER_TIMESTAMP
            },
            {
                "name": "HVAC",
                "iconName": "thermometer",
                "active": True,
                "totalProviders": 0,
                "avgRating": 0,
                "createdAt": firestore.SERVER_TIMESTAMP
            },
            {
                "name": "Carpenter",
                "iconName": "tool",
                "active": True,
                "totalProviders": 0,
                "avgRating": 0,
                "createdAt": firestore.SERVER_TIMESTAMP
            },
            {
                "name": "Painter",
                "iconName": "brush",
                "active": True,
                "totalProviders": 0,
                "avgRating": 0,
                "createdAt": firestore.SERVER_TIMESTAMP
            },
            {
                "name": "Landscaper", 
                "iconName": "tree",
                "active": True,
                "totalProviders": 0,
                "avgRating": 0,
                "createdAt": firestore.SERVER_TIMESTAMP
            },
            {
                "name": "House Cleaner",
                "iconName": "spray",
                "active": True,
                "totalProviders": 0,
                "avgRating": 0,
                "createdAt": firestore.SERVER_TIMESTAMP
            },
            {
                "name": "Locksmith",
                "iconName": "key",
                "active": True,
                "totalProviders": 0,
                "avgRating": 0,
                "createdAt": firestore.SERVER_TIMESTAMP
            },
            {
                "name": "Pest Control",
                "iconName": "bug",
                "active": True,
                "totalProviders": 0,
                "avgRating": 0,
                "createdAt": firestore.SERVER_TIMESTAMP
            },
            {
                "name": "Roofer",
                "iconName": "home",
                "active": True,
                "totalProviders": 0,
                "avgRating": 0,
                "createdAt": firestore.SERVER_TIMESTAMP
            }
        ]

        # Batch write categories
        batch = db_client.batch()
        for category in categories:
            doc_ref = db_client.collection('categories').document()
            batch.set(doc_ref, category)
        batch.commit()
        print("✅ Categories created successfully")

        # Setup initial analytics document
        analytics_ref = db_client.collection('analytics').document('daily')
        analytics_data = {
            'totalUsers': 0,
            'activeUsers': 0,
            'apiCalls': 0,
            'lastUpdated': firestore.SERVER_TIMESTAMP
        }
        analytics_ref.set(analytics_data)
        print("✅ Analytics document created successfully")

    except Exception as e:
        print(f"❌ Error in setup_database: {str(e)}")
        raise e

def check_business_exists(db_client, user_id, business_info):
    """
    Check if a business is already saved by the user
    Returns:
    - None if business not found
    - Document reference if business exists
    """
    query = db_client.collection('savedBusinesses').where('userId', '==', user_id)
    businesses = query.get()
    
    for business in businesses:
        data = business.to_dict()
        saved_business = data['businessInfo']
        # Check if business name and address match
        if (saved_business['name'].lower() == business_info['name'].lower() and 
            saved_business['address'].lower() == business_info['address'].lower()):
            return {
                'exists': True,
                'docId': business.id,
                'savedAt': data.get('savedAt'),
                'message': 'Business already saved'
            }
    return {
        'exists': False,
        'docId': None,
        'message': 'Business not saved yet'
    }

def add_test_data(db_client):
    try:
        # Create a test user
        test_user = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": None,
            "avatar": None,
            "address": None,
            "radiusKm": 25,
            "localeType": None,
            "notifications": {
                "emailUpdates": True,
                "providerReplies": True,
                "recommendations": True,
                "marketing": False,
                "security": True
            },
            "privacy": {
                "showProfilePublic": False,
                "shareActivity": False,
                "aiPersonalization": True,
                "dataCollection": True
            },
            "createdAt": firestore.SERVER_TIMESTAMP,
            "lastLoginAt": firestore.SERVER_TIMESTAMP
        }

        # Add test user
        user_ref = db_client.collection('users').document('test_user_id')
        user_ref.set(test_user)
        print("✅ Test user created successfully")

        # Add sample saved businesses
        saved_businesses = [
            {
                "userId": "test_user_id",
                "businessInfo": {
                    "name": "ABC Plumbing",
                    "rating": "4.5",
                    "reviews": 125,
                    "phone": "+1234567890",
                    "address": "123 Test St, Karachi",
                    "website": "www.abcplumbing.com",
                    "category": "Plumber",
                    "confidence": "HIGH"
                },
                "savedAt": firestore.SERVER_TIMESTAMP
            },
            {
                "userId": "test_user_id",
                "businessInfo": {
                    "name": "Quick Electric",
                    "rating": "4.8",
                    "reviews": 89,
                    "phone": "+1987654321", 
                    "address": "456 Demo Ave, Karachi",
                    "website": "www.quickelectric.com",
                    "category": "Electrician",
                    "confidence": "HIGH"
                },
                "savedAt": firestore.SERVER_TIMESTAMP
            },
            {
                "userId": "test_user_id",
                "businessInfo": {
                    "name": "Cool Air HVAC",
                    "rating": "4.7",
                    "reviews": 156,
                    "phone": "+1234098765",
                    "address": "789 Cool St, Karachi",
                    "website": "www.coolairhvac.com",
                    "category": "HVAC",
                    "confidence": "HIGH"
                },
                "savedAt": firestore.SERVER_TIMESTAMP
            },
            {
                "userId": "test_user_id",
                "businessInfo": {
                    "name": "Pro Painters",
                    "rating": "4.6",
                    "reviews": 78,
                    "phone": "+1230984567",
                    "address": "321 Color Ave, Karachi",
                    "website": "www.propainters.com",
                    "category": "Painter",
                    "confidence": "MEDIUM"
                },
                "savedAt": firestore.SERVER_TIMESTAMP
            }
        ]

        # Add businesses one by one with duplicate checking
        for business in saved_businesses:
            # Check if business already exists for this user
            check_result = check_business_exists(db_client, business['userId'], business['businessInfo'])
            if not check_result['exists']:
                doc_ref = db_client.collection('savedBusinesses').document()
                business['docId'] = doc_ref.id  # Add document ID for frontend reference
                business['isSaved'] = True      # Add saved state for frontend
                doc_ref.set(business)
                print(f"✅ Added business: {business['businessInfo']['name']}")
            else:
                print(f"⚠️ Business already exists: {business['businessInfo']['name']} (DocID: {check_result['docId']})")
        
        print("✅ Sample businesses processing completed")

    except Exception as e:
        print(f"❌ Error in add_test_data: {str(e)}")
        raise e

if __name__ == "__main__":
    try:
        db = initialize_firebase()
        setup_database(db)
        add_test_data(db)
        print("✅ Database setup completed successfully!")
    except Exception as e:
        print(f"❌ Error setting up database: {str(e)}")