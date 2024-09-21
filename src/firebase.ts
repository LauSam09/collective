import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  doc,
  getDocFromCache,
  initializeFirestore,
  persistentLocalCache,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const firestore = initializeFirestore(app, {
  localCache: persistentLocalCache(),
});

export const getFirestoreUser = async (uid: string) => {
  const ref = doc(firestore, "users", uid);
  const snapshot = await getDocFromCache(ref);

  if (!snapshot.exists()) {
    return;
  }

  return { ...snapshot.data(), id: snapshot.id };
};

export * from "firebase/auth";
