import { createContext } from "react";
import { FirebaseApp, initializeApp, getApps } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";
import { Firestore, getFirestore } from "firebase/firestore";
import "firebase/auth";
import "firebase/firestore";

type FirebaseContextType = {
  app: FirebaseApp;
  analytics: Analytics;
  firestore: Firestore;
};

export const FirebaseContext = createContext<FirebaseContextType>({
  app: null!,
  analytics: null!,
  firestore: null!,
});

export type FirebaseContextProviderProps = {
  children: React.ReactNode;
};

const FirebaseContextProvider = ({
  children,
}: FirebaseContextProviderProps) => {
  const apps = getApps();
  const app =
    apps?.[0] ??
    initializeApp({
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    });

  const analytics = getAnalytics(app);
  const firestore = getFirestore(app);

  return (
    <FirebaseContext.Provider value={{ app, analytics, firestore }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseContextProvider;
