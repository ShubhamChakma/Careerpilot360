import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import env from './env.js';

let app = null;
let db = null;
let auth = null;
let isMock = false;

// Custom in-memory Mock Firestore for local development without credentials
class MockFirestore {
  constructor() {
    this.store = {}; // format: collection -> docId -> data
  }
  
  collection(col) {
    if (!this.store[col]) this.store[col] = {};
    const colStore = this.store[col];
    
    return {
      doc: (id) => {
        const docId = id || Math.random().toString(36).substring(7);
        return {
          id: docId,
          set: async (data) => {
            colStore[docId] = { ...data };
            return { id: docId };
          },
          get: async () => {
            const exists = docId in colStore;
            return {
              exists,
              id: docId,
              data: () => colStore[docId] ? { ...colStore[docId] } : null
            };
          },
          update: async (data) => {
            if (!(docId in colStore)) {
              colStore[docId] = {};
            }
            colStore[docId] = { ...colStore[docId], ...data };
            return { id: docId };
          },
          delete: async () => {
            delete colStore[docId];
            return { id: docId };
          }
        };
      },
      add: async (data) => {
        const docId = Math.random().toString(36).substring(7);
        colStore[docId] = { ...data, id: docId };
        return { id: docId };
      },
      get: async () => {
        const docs = Object.entries(colStore).map(([id, val]) => ({
          id,
          exists: true,
          data: () => val
        }));
        return { docs };
      },
      where: (field, op, val) => {
        return {
          get: async () => {
            const docs = Object.entries(colStore)
              .filter(([_, data]) => {
                if (op === '==') return data[field] === val;
                if (op === 'in') return Array.isArray(val) && val.includes(data[field]);
                if (op === 'array-contains') return Array.isArray(data[field]) && data[field].includes(val);
                return true;
              })
              .map(([id, v]) => ({
                id,
                exists: true,
                data: () => v
              }));
            return { docs };
          }
        };
      }
    };
  }
}

const mockAuth = {
  verifyIdToken: async (token) => {
    if (token === 'dev-token' || token.startsWith('dev-user-')) {
      const uid = token === 'dev-token' ? 'dev-user-123' : token.replace('dev-user-', '');
      return {
        uid,
        email: `${uid}@careerpilot360.com`,
        name: 'Developer User',
        email_verified: true
      };
    }
    throw new Error('Invalid token in Mock Auth Mode.');
  }
};

// Auto-detect service account JSON file in root or server directory
const possibleJsonFiles = [
  path.resolve(process.cwd(), '../careerpilot-9cac6-firebase-adminsdk-fbsvc-e6d708f22a.json'),
  path.resolve(process.cwd(), './careerpilot-9cac6-firebase-adminsdk-fbsvc-e6d708f22a.json')
];

let serviceAccountFile = possibleJsonFiles.find(filePath => fs.existsSync(filePath));

try {
  if (serviceAccountFile) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountFile, 'utf8'));
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    auth = admin.auth();
    console.log(`🔥 Firebase Admin SDK initialized successfully via local key file (${path.basename(serviceAccountFile)}).`);
  } else if (env.FIREBASE.projectId && env.FIREBASE.clientEmail && env.FIREBASE.privateKey) {
    let formattedKey = env.FIREBASE.privateKey.trim();
    if (formattedKey.startsWith('"') && formattedKey.endsWith('"')) {
      formattedKey = formattedKey.substring(1, formattedKey.length - 1);
    }
    formattedKey = formattedKey.replace(/\\n/g, '\n');

    app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.FIREBASE.projectId,
        clientEmail: env.FIREBASE.clientEmail,
        privateKey: formattedKey,
      })
    });
    db = admin.firestore();
    auth = admin.auth();
    console.log('🔥 Firebase Admin SDK initialized successfully via Environment Variables.');
  } else {
    isMock = true;
    db = new MockFirestore();
    auth = mockAuth;
    console.log('🤖 Firebase is running in in-memory Mock Mode.');
  }
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin SDK. Falling back to Mock mode.', error.message);
  isMock = true;
  db = new MockFirestore();
  auth = mockAuth;
}

export { admin, db, auth, isMock };
