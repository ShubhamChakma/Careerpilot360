import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const {
  VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID,
} = import.meta.env;

const missingKeys = [
  ['VITE_FIREBASE_API_KEY', VITE_FIREBASE_API_KEY],
  ['VITE_FIREBASE_AUTH_DOMAIN', VITE_FIREBASE_AUTH_DOMAIN],
  ['VITE_FIREBASE_PROJECT_ID', VITE_FIREBASE_PROJECT_ID],
  ['VITE_FIREBASE_APP_ID', VITE_FIREBASE_APP_ID],
].filter(([, v]) => !v).map(([k]) => k);

if (missingKeys.length > 0) {
  console.error(
    `[CareerPilot360] Missing Firebase environment variables: ${missingKeys.join(', ')}.\n` +
    'Copy client/.env.example to client/.env and fill in your Firebase project credentials.\n' +
    'Get them from: Firebase Console → Project Settings → Your apps → Web app config.'
  );
}

const firebaseConfig = {
  apiKey: VITE_FIREBASE_API_KEY,
  authDomain: VITE_FIREBASE_AUTH_DOMAIN,
  projectId: VITE_FIREBASE_PROJECT_ID,
  storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: VITE_FIREBASE_APP_ID,
};

let app, auth, db, storage;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (err) {
  console.error('[CareerPilot360] Firebase failed to initialise:', err.message);
  // Export null stubs so imports don't crash at module level
  auth = null;
  db = null;
  storage = null;
}

export { auth, db, storage };