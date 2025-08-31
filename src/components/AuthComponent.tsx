import React, { useState, useEffect } from 'react';
import { AuthUser, AuthService } from '../services/AuthService';
import { Button } from './ui/Button';

interface AuthComponentProps {
  onAuthStateChange: (user: AuthUser | null) => void;
}

export const AuthComponent: React.FC<AuthComponentProps> = ({ onAuthStateChange }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const authService = AuthService.getInstance();

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = authService.onAuthStateChange((user: AuthUser | null) => {
      onAuthStateChange(user);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [onAuthStateChange, authService]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.signInWithGoogle();
    } catch (error) {
      setError('Failed to sign in with Google');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.signInWithFacebook();
    } catch (error) {
      setError('Failed to sign in with Facebook');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.signOut();
    } catch (error) {
      setError('Failed to sign out');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="flex flex-col space-y-2">
        <Button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
        >
          <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
          <span>Sign in with Google</span>
        </Button>

        <Button
          onClick={handleFacebookSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white hover:bg-blue-700"
        >
          <img src="/facebook-icon.svg" alt="Facebook" className="w-5 h-5" />
          <span>Sign in with Facebook</span>
        </Button>
      </div>
    </div>
  );
};
