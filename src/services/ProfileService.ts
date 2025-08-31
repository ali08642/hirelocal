import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { UserProfile } from '../types/firebase';

export const ProfileService = {
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  async createProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    try {
      const profile: Partial<UserProfile> = {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        preferences: {
          theme: 'light',
          notifications: true
        }
      };

      await setDoc(doc(db, 'users', userId), profile);
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  },

  async updateProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    try {
      const updates = {
        ...data,
        updatedAt: new Date()
      };

      await updateDoc(doc(db, 'users', userId), updates);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  async updatePreferences(userId: string, preferences: UserProfile['preferences']): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        preferences,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }
};
