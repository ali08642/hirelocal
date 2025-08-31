import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { initializeFirestore } from 'firebase/firestore';
import { setPersistence, browserLocalPersistence, onAuthStateChanged } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

// Initialize Firestore with persistence enabled
export const db = initializeFirestore(app, {
  cacheSizeBytes: 50 * 1024 * 1024, // 50 MB cache size
  experimentalAutoDetectLongPolling: true, // Automatically detect if long polling is needed
});

console.log('[FIREBASE] Connected to production Firebase');

// Enable auth persistence
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('[FIREBASE] Auth persistence enabled');
  })
  .catch((error) => {
    console.error('[FIREBASE] Auth persistence error:', error);
  });

// Monitor auth state
onAuthStateChanged(auth, (user) => {
  console.log('[FIREBASE] Auth state changed:', user ? 'Logged in' : 'Logged out');
  if (user) {
    // Force token refresh on auth state change
    user.getIdToken(true)
      .then(() => console.log('[FIREBASE] Token refreshed'))
      .catch(error => console.error('[FIREBASE] Token refresh failed:', error));
  }
});

export default app;