import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged,
  signOut,
  User 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from './config';

export const googleProvider = new GoogleAuthProvider();

// Auth Methods - exactly what AuthContext.tsx expects
export const firebaseAuth = {
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await this.createUserProfile(result.user);
      return result.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  },

  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  async createUserProfile(user: any) {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const userData = {
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        notifications: {
          emailUpdates: true,
          providerReplies: true,
          recommendations: true,
          marketing: false,
          security: true
        },
        privacy: {
          showProfilePublic: false,
          shareActivity: false,
          aiPersonalization: true,
          dataCollection: true
        }
      };
      await setDoc(userRef, userData);
    } else {
      await setDoc(userRef, {
        lastLoginAt: serverTimestamp()
      }, { merge: true });
    }
  },

  async signOut() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }
};

// User Methods - exactly what AuthContext.tsx expects
export const userService = {
  async createUserProfile(user: User) {
    try {
      const userRef = doc(db, 'users', user.uid);
      
      const userProfile = {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(userRef, userProfile, { merge: true });
      
      return {
        id: user.uid,
        ...userProfile,
      };
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  },

  async getUserProfile(uid: string) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (!userDoc.exists()) {
        return null;
      }
      
      const data = userDoc.data();
      
      return {
        id: uid,
        email: data.email,
        displayName: data.displayName,
        photoURL: data.photoURL,
        lastLogin: data.lastLogin?.toDate?.() || new Date(),
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date()
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  async updateUserProfile(uid: string, data: any) {
    try {
      await setDoc(doc(db, 'users', uid), {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
};