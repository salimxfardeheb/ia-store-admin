import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

// Validation explicite avant l'init
if (!projectId || !clientEmail || !privateKey) {
  throw new Error(
    `Firebase Admin: variables manquantes →
    FIREBASE_ADMIN_PROJECT_ID: ${projectId ? '✅' : '❌'}
    FIREBASE_ADMIN_CLIENT_EMAIL: ${clientEmail ? '✅' : '❌'}
    FIREBASE_ADMIN_PRIVATE_KEY: ${privateKey ? '✅' : '❌'}`
  );
}

if (!getApps().length) {
  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();