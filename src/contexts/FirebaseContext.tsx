import { createContext, useEffect, useState } from "react"
import { FirebaseApp, initializeApp, deleteApp } from "firebase/app"
import "firebase/auth"
import "firebase/firestore"

type FirebaseContextType = {
  firebaseApp: FirebaseApp | null
}

export const FirebaseContext = createContext<FirebaseContextType>({
  firebaseApp: null,
})

export type FirebaseContextProviderProps = {
  children: React.ReactNode
}

const FirebaseContextProvider = ({
  children,
}: FirebaseContextProviderProps) => {
  const [firebaseApp, setFirebaseApp] = useState<FirebaseApp | null>(null)

  useEffect(() => {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    }

    const app = initializeApp(firebaseConfig)

    setFirebaseApp(app)

    return () => {
      deleteApp(app)
    }
  }, [])

  if (!firebaseApp) {
    return null
  }

  return (
    <FirebaseContext.Provider value={{ firebaseApp }}>
      {children}
    </FirebaseContext.Provider>
  )
}

export default FirebaseContextProvider
