import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import appletConfig from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== 'PLACEHOLDER_IN_APP_SETTINGS' 
    ? import.meta.env.VITE_FIREBASE_API_KEY 
    : appletConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN && import.meta.env.VITE_FIREBASE_AUTH_DOMAIN !== 'PLACEHOLDER_IN_APP_SETTINGS'
    ? import.meta.env.VITE_FIREBASE_AUTH_DOMAIN 
    : appletConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID && import.meta.env.VITE_FIREBASE_PROJECT_ID !== 'PLACEHOLDER_IN_APP_SETTINGS'
    ? import.meta.env.VITE_FIREBASE_PROJECT_ID 
    : appletConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET && import.meta.env.VITE_FIREBASE_STORAGE_BUCKET !== 'PLACEHOLDER_IN_APP_SETTINGS'
    ? import.meta.env.VITE_FIREBASE_STORAGE_BUCKET 
    : appletConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID && import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID !== 'PLACEHOLDER_IN_APP_SETTINGS'
    ? import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID 
    : appletConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID && import.meta.env.VITE_FIREBASE_APP_ID !== 'PLACEHOLDER_IN_APP_SETTINGS'
    ? import.meta.env.VITE_FIREBASE_APP_ID 
    : appletConfig.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID && import.meta.env.VITE_FIREBASE_MEASUREMENT_ID !== 'PLACEHOLDER_IN_APP_SETTINGS'
    ? import.meta.env.VITE_FIREBASE_MEASUREMENT_ID 
    : appletConfig.measurementId
};

const app = initializeApp(firebaseConfig);
const dbId = import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID && import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID !== 'PLACEHOLDER_IN_APP_SETTINGS'
  ? import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID
  : (appletConfig.firestoreDatabaseId && appletConfig.firestoreDatabaseId !== 'PLACEHOLDER_IN_APP_SETTINGS' ? appletConfig.firestoreDatabaseId : '(default)');

export const db = getFirestore(app, dbId);
export const auth = getAuth(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
