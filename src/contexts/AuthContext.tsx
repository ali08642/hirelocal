import React, { createContext, useState, useEffect } from 'react';
import { firebaseAuth, userService } from '../firebase/auth';
import { User } from 'firebase/auth';

interface UserProfile {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: string | null | Date | unknown;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
      try {
        console.log("[AUTH] Auth state changed:", user ? "Logged in" : "Logged out");
        setUser(user);
        
        if (user) {
          try {
            // Wait for token to be ready with retry
            let token = null;
            for (let i = 0; i < 3; i++) {
              try {
                token = await user.getIdToken(true); // Force token refresh
                if (token) break;
              } catch (e) {
                console.warn("[AUTH] Token fetch attempt failed:", i + 1);
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between retries
              }
            }
            
            if (!token) {
              throw new Error("Failed to get valid auth token after retries");
            }
            
            console.log("[AUTH] Got user token:", token ? "Valid" : "Missing");
            
            // Attempt to get or create user profile with retries
            let profile = null;
            let retries = 0;
            while (!profile && retries < 3) {
              try {
                profile = await userService.getUserProfile(user.uid);
                if (!profile) {
                  console.log("[AUTH] Creating new user profile");
                  await userService.createUserProfile(user);
                  profile = await userService.getUserProfile(user.uid);
                }
                break;
              } catch (e) {
                console.warn("[AUTH] Profile fetch/create attempt failed:", retries + 1);
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between retries
                retries++;
              }
            }
            
            if (profile) {
              setUserProfile(profile);
              console.log("[AUTH] Profile set successfully");
            } else {
              // Fall back to basic profile if Firestore operations fail
              const basicProfile: UserProfile = {
                id: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                createdAt: new Date(),
                updatedAt: new Date()
              };
              setUserProfile(basicProfile);
              console.log("[AUTH] Using basic profile fallback");
            }
          } catch (error) {
            console.error('[AUTH] Error fetching/creating user profile:', error);
            // Set a basic profile with just the user's info from Firebase Auth
            const basicProfile: UserProfile = {
              id: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              createdAt: new Date(),
              updatedAt: new Date()
            };
            setUserProfile(basicProfile);
            console.log("[AUTH] Set basic profile as fallback");
          }
        } else {
          // Clear both user and profile when logged out
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        // Reset state on error
        setUser(null);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await firebaseAuth.signInWithGoogle();
      if (!result) throw new Error('No user returned from Google sign in');
      const profile = await userService.getUserProfile(result.uid);
      if (profile) {
        setUserProfile(profile as UserProfile);
      } else {
        const basicProfile: UserProfile = {
          id: result.uid,
          email: result.email,
          displayName: result.displayName,
          photoURL: result.photoURL,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setUserProfile(basicProfile);
      }
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseAuth.signOut();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');
    try {
      await userService.updateUserProfile(user.uid, data);
      setUserProfile((prev: UserProfile | null) => prev ? { ...prev, ...data } : null);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signInWithGoogle,
        signOut,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// End of AuthContext
