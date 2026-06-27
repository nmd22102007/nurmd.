import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import appletConfig from '../../firebase-applet-config.json';

const getEnvVar = (viteKey: string, nextKey: string, fallback: string): string => {
  const viteValue = import.meta.env[viteKey];
  const nextValue = import.meta.env[nextKey];
  
  if (viteValue && viteValue !== 'PLACEHOLDER_IN_APP_SETTINGS') {
    return viteValue;
  }
  if (nextValue && nextValue !== 'PLACEHOLDER_IN_APP_SETTINGS') {
    return nextValue;
  }
  return fallback;
};

const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY', 'NEXT_PUBLIC_FIREBASE_API_KEY', appletConfig.apiKey),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN', 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', appletConfig.authDomain),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID', 'NEXT_PUBLIC_FIREBASE_PROJECT_ID', appletConfig.projectId),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET', 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', appletConfig.storageBucket),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID', 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', appletConfig.messagingSenderId),
  appId: getEnvVar('VITE_FIREBASE_APP_ID', 'NEXT_PUBLIC_FIREBASE_APP_ID', appletConfig.appId),
  measurementId: getEnvVar('VITE_FIREBASE_MEASUREMENT_ID', 'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID', appletConfig.measurementId),
  databaseURL: getEnvVar('VITE_FIREBASE_DATABASE_URL', 'NEXT_PUBLIC_FIREBASE_DATABASE_URL', (appletConfig as any).databaseURL || '')
};

const app = initializeApp(firebaseConfig);
const dbId = getEnvVar('VITE_FIREBASE_FIRESTORE_DATABASE_ID', 'NEXT_PUBLIC_FIRESTORE_DATABASE_ID', appletConfig.firestoreDatabaseId || '(default)');

export const db = getFirestore(app, dbId);
export const auth = getAuth(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
