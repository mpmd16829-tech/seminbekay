import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { firebaseConfig } from './config';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with custom databaseId from config if provided
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? initializeFirestore(app, {}, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);

// Helper for optional authentication (graceful when anonymous auth is not enabled in Firebase project)
export const ensureAuthenticated = async (): Promise<User | null> => {
  return new Promise((resolve) => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        resolve(currentUser);
        return;
      }

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe();
        if (user) {
          resolve(user);
        } else {
          try {
            const cred = await signInAnonymously(auth);
            resolve(cred.user);
          } catch (error) {
            // Anonymous sign-in may be restricted/disabled in Firebase Console; continue gracefully in unauthenticated/public mode
            resolve(null);
          }
        }
      });
    } catch {
      resolve(null);
    }
  });
};

export { app };
