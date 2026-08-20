import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  signInWithPopup,
  getRedirectResult,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

// Official Firebase configuration for everyday-focus-todolist
const firebaseConfig = {
  apiKey: "AIzaSyBGIk2m30gLI6ZC6Gw6qv6tS65xnXD7IaU",
  authDomain: "everyday-focus-todolist.firebaseapp.com",
  databaseURL: "https://everyday-focus-todolist-default-rtdb.firebaseio.com",
  projectId: "everyday-focus-todolist",
  storageBucket: "everyday-focus-todolist.firebasestorage.app",
  messagingSenderId: "885811005830",
  appId: "1:885811005830:web:0e4c5b763c386a2cea8407"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Direct Google Redirect Sign-In (Bypasses popup blockers completely)
 */
export async function loginWithGoogle() {
  try {
    // Try redirect sign in directly (works on all browsers & mobile without pop-up blockers)
    return await signInWithRedirect(auth, googleProvider);
  } catch (error) {
    console.warn('Redirect login error, trying popup fallback:', error);
    return signInWithPopup(auth, googleProvider);
  }
}

/**
 * Handle Auth Redirect Result on Page Load
 */
export function checkRedirectResult() {
  return getRedirectResult(auth);
}

/**
 * Sign Out
 */
export function logoutFirebase() {
  return signOut(auth);
}

/**
 * Auth state listener
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Sync user data to Firebase Realtime Database using user.uid
 */
export function pushUserDataToFirebase(userId, data) {
  if (!userId) return Promise.resolve(false);
  const userRef = ref(database, `users/${userId}`);

  return set(userRef, {
    ...data,
    lastUpdated: Date.now(),
  }).then(() => true).catch((err) => {
    console.warn('Firebase sync push notice:', err);
    return false;
  });
}

/**
 * Subscribe to user data updates in real time
 */
export function subscribeToUserRoom(userId, onUpdate) {
  if (!userId) return () => {};
  const userRef = ref(database, `users/${userId}`);

  const unsubscribe = onValue(userRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      onUpdate(data);
    }
  });

  return unsubscribe;
}
