import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query as firestoreQuery, 
  where, 
  deleteDoc,
  setDoc,
  Query,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import type { Business, BusinessLocation } from '../types/firebase';

export const BusinessService = {
  saveBusiness: async (userId: string, business: Business): Promise<string> => {
    if (!userId) {
      throw new Error('User must be authenticated to save businesses');
    }

    try {
      const currentUser = auth.currentUser;
      if (!currentUser || currentUser.uid !== userId) {
        throw new Error('User must be authenticated to save businesses');
      }

      await currentUser.getIdToken(true);
      console.log('[BUSINESS] Authentication verified for user:', userId);
      
      // Check for duplicates before saving
      const existingBusinessesQuery = firestoreQuery(
        collection(db, 'savedBusinesses'),
        where('userId', '==', userId),
        where('businessInfo.name', '==', business.name || 'Unnamed Business')
      );
      
      const existingSnapshot = await getDocs(existingBusinessesQuery);
      
      // Check if business already exists for this user
      const isDuplicate = existingSnapshot.docs.some(doc => {
        const data = doc.data();
        const existingBusiness = data.businessInfo;
        
        // Match by name and location (or other unique identifiers)
        const nameMatch = existingBusiness.name === (business.name || 'Unnamed Business');
        const locationMatch = JSON.stringify(existingBusiness.location || {}) === 
                             JSON.stringify(business.location || {});
        
        return nameMatch && locationMatch;
      });
      
      if (isDuplicate) {
        console.log('[BUSINESS] Business already saved for this user');
        throw new Error('This business is already in your saved list');
      }
      
      // Generate unique document ID
      const saveDocRef = doc(collection(db, 'savedBusinesses'));
      
      // Clean business data to avoid property conflicts
      const cleanBusinessInfo = {
        name: business.name || 'Unnamed Business',
        description: business.description || '',
        category: business.category || 'uncategorized',
        services: business.services || [],
        location: business.location || {},
        phone: business.phone || '',
        website: business.website || '',
        rating: business.rating || '',
        reviews: business.reviews || 0,
      };
      
      const businessData = {
        userId: userId, // Key field for security rules
        businessInfo: cleanBusinessInfo,
        savedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      };

      // Save to top-level savedBusinesses collection
      await setDoc(saveDocRef, businessData);
      
      console.log('[BUSINESS] Business saved successfully:', saveDocRef.id);
      return saveDocRef.id; // Return the Firebase document ID
    } catch (error) {
      console.error('Error saving business:', error);
      throw error;
    }
  },

  unsaveBusiness: async (userId: string, saveId: string): Promise<void> => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser || currentUser.uid !== userId) {
        throw new Error('User must be authenticated');
      }

      // Verify the document belongs to the user before deleting
      const docRef = doc(db, 'savedBusinesses', saveId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Business not found');
      }
      
      const data = docSnap.data();
      if (data.userId !== userId) {
        throw new Error('Cannot delete another user\'s saved business');
      }

      // Delete from savedBusinesses collection
      await deleteDoc(docRef);
      
      console.log('[BUSINESS] Business unsaved successfully:', saveId);
    } catch (error: unknown) {
      console.error('Error removing saved business:', error);
      throw error;
    }
  },

  getSavedBusinesses: async (userId: string): Promise<Business[]> => {
    if (!userId) {
      throw new Error('User must be authenticated to get saved businesses');
    }

    try {
      const currentUser = auth.currentUser;
      if (!currentUser || currentUser.uid !== userId) {
        throw new Error('User must be authenticated');
      }
      
      await currentUser.getIdToken(true);
      console.log('[BUSINESS] Authentication verified for getSavedBusinesses');

      // Query top-level savedBusinesses collection
      const q = firestoreQuery(
        collection(db, 'savedBusinesses'),
        where('userId', '==', userId),
        orderBy('savedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        
        // Handle both old and new schema formats
        let businessData;
        
        if (data.businessInfo) {
          // New format - data is nested under businessInfo
          businessData = data.businessInfo;
        } else {
          // Old format - data is at root level
          businessData = data;
        }
        
        return {
          id: doc.id, // This is the save document ID
          name: businessData.name || '',
          description: businessData.description || '',
          category: businessData.category || '',
          services: businessData.services || [],
          location: {
            address: businessData.address,
            city: businessData.city,
            state: businessData.state,
            zip: businessData.zip,
            coordinates: businessData.coordinates
          },
          saved: true,
          savedAt: data.savedAt?.toDate?.() || new Date(),
          phone: businessData.phone || '',
          website: businessData.website || '',
          rating: businessData.rating || '',
          reviews: businessData.reviews || 0
        } as Business;
      });
    } catch (error) {
      console.error('Error getting saved businesses:', error);
      throw error;
    }
  },

  getBusinessById: async (id: string): Promise<Business | null> => {
    try {
      const docRef = doc(db, 'businesses', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Business;
      }
      return null;
    } catch (error) {
      console.error('Error fetching business:', error);
      throw error;
    }
  },

  searchBusinesses: async (params: {
    category?: string;
    query?: string;
    location?: string;
    tags?: string[];
  }): Promise<Business[]> => {
    try {
      const businessesRef = collection(db, 'businesses');
      let baseQuery: Query = businessesRef as Query;
      
      // Add filters based on params
      if (params.category) {
        baseQuery = firestoreQuery(baseQuery, where('category', '==', params.category));
      }
      
      if (params.tags && params.tags.length > 0) {
        baseQuery = firestoreQuery(baseQuery, where('tags', 'array-contains-any', params.tags));
      }

      const querySnapshot = await getDocs(baseQuery);
      const businesses: Business[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        businesses.push({ 
          id: doc.id, 
          name: (data.name as string) || '',
          description: (data.description as string) || '',
          category: (data.category as string) || '',
          services: (data.services as string[]) || [],
          location: (data.location as BusinessLocation) || {},
          saved: false
        } as Business);
      });

      // Client-side filtering for search query
      if (params.query) {
        const searchQuery = params.query.toLowerCase();
        return businesses.filter(business => 
          business.name.toLowerCase().includes(searchQuery) ||
          business.description.toLowerCase().includes(searchQuery) ||
          business.services.some(service => service.toLowerCase().includes(searchQuery))
        );
      }

      return businesses;
    } catch (error) {
      console.error('Error searching businesses:', error);
      throw error;
    }
  }
};