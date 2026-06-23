// Firebase initialization
// Docs: https://firebase.google.com/docs/web/setup

import { initializeApp, getApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Check if Firebase is configured
export const isFirebaseConfigured =
  !!firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'your_api_key_here' &&
  firebaseConfig.apiKey.trim() !== ''

let app: any = null
let auth: any = null
let db: any = null
let analytics: any = null

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
    auth = getAuth(app)
    db = getFirestore(app)
    // Analytics is client-only and might fail in certain environments
    if (typeof window !== 'undefined') {
      analytics = getAnalytics(app)
    }
  } catch (error) {
    console.error('Firebase initialization failed:', error)
  }
} else {
  console.warn(
    'Firebase environment variables are not configured. Running in Mock Auth Mode.'
  )
}

export { app, auth, db, analytics }
export default app

