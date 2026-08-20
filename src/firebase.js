import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue } from 'firebase/database';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  setPersistence,
  browserLocalPersistence
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

// Ensure local persistence is set so reloads NEVER log out
try {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn('Firebase setPersistence notice:', err);
  });
} catch (e) {
  console.warn('Persistence initialization notice:', e);
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Register with Email, Password & Full Name
 */
export async function registerWithEmail(name, email, password) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  if (name && name.trim()) {
    await updateProfile(user, {
      displayName: name.trim()
    });
  }

  // Save initial user profile metadata to cloud
  await pushUserDataToFirebase(user.uid, {
    profile: {
      displayName: name?.trim() || email.split('@')[0],
      email: user.email,
      createdAt: Date.now()
    }
  });

  return user;
}

/**
 * Sign In with Email & Password
 */
export async function loginWithEmail(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

/**
 * Google 1-Click Sign-In
 */
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.warn('Popup login notice, trying redirect fallback:', error);
    if (
      error.code === 'auth/popup-blocked' ||
      error.code === 'auth/popup-closed-by-user' ||
      error.code === 'auth/cancelled-popup-request' ||
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    ) {
      return signInWithRedirect(auth, googleProvider);
    }
    throw error;
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
 * Push user data to Firebase Realtime Database with local backup
 */
export async function pushUserDataToFirebase(userId, data) {
  if (!userId) return false;
  
  // Always update local device cache for this specific user
  try {
    localStorage.setItem(`everyday_user_cloud_cache_${userId}`, JSON.stringify(data));
  } catch (e) {
    console.warn('Local user cache write error:', e);
  }

  try {
    const userRef = ref(database, `users/${userId}`);
    await set(userRef, {
      ...data,
      lastUpdated: Date.now(),
    });
    return true;
  } catch (err) {
    console.warn('Firebase push sync notice (saved locally):', err);
    return false;
  }
}

/**
 * Fetch initial user cloud data from Firebase with local cache fallback
 */
export async function getUserDataFromFirebase(userId) {
  if (!userId) return null;

  try {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      localStorage.setItem(`everyday_user_cloud_cache_${userId}`, JSON.stringify(data));
      return data;
    }
  } catch (e) {
    console.warn('Remote user fetch notice, checking local cache:', e);
  }

  // Fallback to local cache for this user
  try {
    const cached = localStorage.getItem(`everyday_user_cloud_cache_${userId}`);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.warn('Cache parsing notice:', e);
  }

  return null;
}

/**
 * Subscribe to user data updates in real time
 */
export function subscribeToUserRoom(userId, onUpdate) {
  if (!userId) return () => {};
  const userRef = ref(database, `users/${userId}`);

  try {
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        onUpdate(data);
      }
    }, (error) => {
      console.warn('Realtime subscription notice:', error);
    });

    return unsubscribe;
  } catch (e) {
    console.warn('Subscription initialization error:', e);
    return () => {};
  }
}
