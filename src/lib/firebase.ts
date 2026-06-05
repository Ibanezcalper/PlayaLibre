import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDataConnect, connectDataConnectEmulator } from 'firebase/data-connect';
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth';
import { connectorConfig } from '../dataconnect-generated';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if credentials are set (so it runs dual-mode)
const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;

let app;
let dataConnectInstance: ReturnType<typeof getDataConnect> | null = null;
let authInstance: ReturnType<typeof getAuth> | null = null;
const googleProvider = new GoogleAuthProvider();

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    dataConnectInstance = getDataConnect(app, connectorConfig);
    authInstance = getAuth(app);
    
    // In local development or environment without VITE_FIREBASE_API_KEY being production,
    // connect to the local Data Connect emulator.
    if (import.meta.env.DEV) {
      connectDataConnectEmulator(dataConnectInstance, 'localhost', 9399);
      console.log('Connected to Firebase SQL Connect Emulator (localhost:9399)');
      
      connectAuthEmulator(authInstance, 'http://localhost:9099', { disableWarnings: true });
      console.log('Connected to Firebase Auth Emulator (http://localhost:9099)');
    } else {
      console.log('Firebase SQL Connect client successfully initialized!');
    }
  } catch (error) {
    console.error('Failed to initialize Firebase SQL Connect client:', error);
  }
} else {
  console.warn('Firebase VITE keys are missing. Running in Local Mock Database mode.');
}

export { dataConnectInstance, authInstance, googleProvider, isFirebaseConfigured };

