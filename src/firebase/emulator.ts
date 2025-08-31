export const connectToEmulator = async () => {
  if (process.env.NODE_ENV === 'development') {
    const { connectFirestoreEmulator } = await import('firebase/firestore');
    const { connectAuthEmulator } = await import('firebase/auth');
    const { db, auth } = await import('./config');
    
    try {
      connectFirestoreEmulator(db, 'localhost', 8080);
      connectAuthEmulator(auth, 'http://localhost:9099');
      console.log('[FIREBASE] Connected to emulators');
    } catch (error) {
      console.error('[FIREBASE] Error connecting to emulators:', error);
    }
  }
};
