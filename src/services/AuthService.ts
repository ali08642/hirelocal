import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, firebaseConfig } from '../firebase/config';

// Provider instances
const googleProvider = new GoogleAuthProvider();

export interface AuthUser extends User {
  provider?: string;
}

export class AuthService {
  private static instance: AuthService;
  private currentUser: AuthUser | null = null;

  private constructor() {
    // Initialize auth state listener
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user as AuthUser;
    });
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async signInWithGoogle() {
    try {
      console.log('Starting Google sign-in...');
      console.log('Firebase Config:', {
        authDomain: firebaseConfig.authDomain,
        projectId: firebaseConfig.projectId,
        apiKeyLastFour: firebaseConfig.apiKey ? firebaseConfig.apiKey.slice(-4) : 'none'
      });
      
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Sign-in popup completed');
      
      const user = result.user as AuthUser;
      user.provider = 'google';
      console.log('User authenticated:', user.email);
      
      // Get ID token
      const idToken = await user.getIdToken();
      console.log('Got ID token');
      
      // Verify with backend
      await this.verifyWithBackend(idToken, 'google');
      console.log('Backend verification complete');
      
      return user;
    } catch (error) {
      console.error('Google sign-in error:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        if ('code' in error) {
          console.error('Firebase error code:', (error as any).code);
        }
      }
      throw new Error(error instanceof Error ? error.message : 'Failed to sign in with Google');
    }
  }



  private async verifyWithBackend(token: string, provider: string) {
    try {
      const baseUrl = import.meta.env.DEV ? 'http://localhost:8000' : '';
      const response = await fetch(`${baseUrl}/api/auth/verify-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ token, provider }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to verify token with backend');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Backend verification error:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      await signOut(auth);
      this.currentUser = null;
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    }
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return onAuthStateChanged(auth, (user) => {
      this.currentUser = user as AuthUser;
      callback(this.currentUser);
    });
  }

  async updateUserProfile(userId: string, profileData: Partial<AuthUser>) {
    try {
      const response = await fetch(`/api/auth/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }
}
