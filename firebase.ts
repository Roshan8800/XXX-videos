// Firebase configuration and initialization
// This file sets up Firebase services for use throughout the app

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBusBtIL7OaDH5Y9rUNwWDg0yzEK_gaSr4",
  authDomain: "streamr-2f1c1.firebaseapp.com",
  databaseURL: "https://streamr-2f1c1-default-rtdb.firebaseio.com",
  projectId: "streamr-2f1c1",
  storageBucket: "streamr-2f1c1.firebasestorage.app",
  messagingSenderId: "366584078843",
  appId: "1:366584078843:web:233aef07cb881f7214ab5e",
  measurementId: "G-C57LP21XFM"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Export the Firebase app instance for advanced usage
export { app };

// Export Firebase configuration for use in other parts of the app
export { firebaseConfig };

// Export Firebase modules for direct usage if needed
export { initializeApp } from 'firebase/app';
export { getAuth } from 'firebase/auth';
export { getFirestore } from 'firebase/firestore';
export { getStorage } from 'firebase/storage';

// Export types for TypeScript support
export type { FirebaseApp, FirebaseOptions } from 'firebase/app';
export type { Auth } from 'firebase/auth';
export type { Firestore } from 'firebase/firestore';
export type { FirebaseStorage } from 'firebase/storage';

// Default export for convenience
export default app;