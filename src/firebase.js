import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
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
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const database = getDatabase(app);

// Configure persistent authentication
try {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn('Firebase setPersistence notice:', err);
  });
} catch (e) {
  console.warn('Persistence notice:', e);
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

  // Push initial profile to cloud
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
 * Google 1-Click Sign-In (Popup with Redirect Fallback for mobile)
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
 * Push user data to Firestore and Realtime Database with robust error handling
 */
export async function pushUserDataToFirebase(userId, data) {
  if (!userId) return false;
  
  const payload = {
    tasks: data.tasks || [],
    habits: data.habits || [],
    settings: data.settings || {},
    streakData: data.streakData || {},
    lastUpdated: Date.now(),
  };

  // 1. Update local cache
  try {
    localStorage.setItem(`everyday_user_cloud_cache_${userId}`, JSON.stringify(payload));
  } catch (e) {
    console.warn('Local cache error:', e);
  }

  let firestoreSuccess = false;
  let rtdbSuccess = false;

  // 2. Push to Firestore
  try {
    const userDoc = doc(firestore, 'users', userId);
    await setDoc(userDoc, payload, { merge: true });
    firestoreSuccess = true;
  } catch (err) {
    console.warn('Firestore sync notice:', err);
  }

  // 3. Push to Realtime Database
  try {
    const userRef = ref(database, `users/${userId}`);
    await set(userRef, payload);
    rtdbSuccess = true;
  } catch (err) {
    console.warn('RTDB sync notice:', err);
  }

  return firestoreSuccess || rtdbSuccess;
}

/**
 * Fetch initial user cloud data (Tries Firestore, then RTDB, then Local Cache)
 */
export async function getUserDataFromFirebase(userId) {
  if (!userId) return null;

  // 1. Try Firestore first
  try {
    const userDoc = doc(firestore, 'users', userId);
    const docSnap = await getDoc(userDoc);
    if (docSnap.exists()) {
      const data = docSnap.data();
      localStorage.setItem(`everyday_user_cloud_cache_${userId}`, JSON.stringify(data));
      return data;
    }
  } catch (e) {
    console.warn('Firestore fetch notice, checking RTDB fallback:', e);
  }

  // 2. Try Realtime Database
  try {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      localStorage.setItem(`everyday_user_cloud_cache_${userId}`, JSON.stringify(data));
      return data;
    }
  } catch (e) {
    console.warn('RTDB fetch notice, checking local cache:', e);
  }

  // 3. Try Local User Cache
  try {
    const cached = localStorage.getItem(`everyday_user_cloud_cache_${userId}`);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.warn('Local cache read error:', e);
  }

  return null;
}

/**
 * Subscribe to user data updates in real time (Firestore Snapshot + RTDB Value)
 */
export function subscribeToUserRoom(userId, onUpdate) {
  if (!userId) return () => {};

  let unsubFirestore = () => {};
  let unsubRtdb = () => {};

  // Subscribe to Firestore
  try {
    const userDoc = doc(firestore, 'users', userId);
    unsubFirestore = onSnapshot(userDoc, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        onUpdate(data);
      }
    }, (err) => {
      console.warn('Firestore subscription notice:', err);
    });
  } catch (e) {
    console.warn('Firestore subscription init error:', e);
  }

  // Subscribe to RTDB
  try {
    const userRef = ref(database, `users/${userId}`);
    unsubRtdb = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        onUpdate(data);
      }
    }, (err) => {
      console.warn('RTDB subscription notice:', err);
    });
  } catch (e) {
    console.warn('RTDB subscription init error:', e);
  }

  return () => {
    try { unsubFirestore(); } catch(e) {}
    try { unsubRtdb(); } catch(e) {}
  };
}
