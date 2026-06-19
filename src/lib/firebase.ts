import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

function getMissingKeys() {
  return Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);
}

function getFirebaseApp(): FirebaseApp {
  const missingKeys = getMissingKeys();

  if (missingKeys.length > 0) {
    throw new Error(
      `Faltan variables de entorno de Firebase: ${missingKeys.join(', ')}. ` +
        'Creá un archivo .env.local con esos valores para habilitar Auth y Firestore.',
    );
  }

  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }

  return getApp();
}

export function getAuthInstance() {
  return getAuth(getFirebaseApp());
}

export function getDbInstance() {
  return getFirestore(getFirebaseApp());
}