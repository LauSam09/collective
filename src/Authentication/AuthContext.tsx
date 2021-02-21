import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"

import fbConfig from "../config/firebase.json"
import User from "./models/user"

const googleProvider = new firebase.auth.GoogleAuthProvider()

type AuthContextType = {
  login: () => Promise<void>
  logout: () => Promise<void>
  user?: User
}

const AuthContext = createContext<Partial<AuthContextType>>({})

type AuthProviderProps = {
  children?: ReactNode
}

function AuthProvider(props: AuthProviderProps) {
  const [fbInitialised, setFbInitialised] = useState(false)
  const [user, setUser] = useState<User>()

  useEffect(() => {
    firebase.initializeApp(fbConfig)
    firebase.firestore().enablePersistence({ synchronizeTabs: true })

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser({ displayName: user.displayName ?? undefined })
      } else {
        setUser(undefined)
      }

      setFbInitialised(true)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  async function login() {
    await firebase.auth().signInWithPopup(googleProvider)
  }

  async function logout() {
    await firebase.auth().signOut()
  }

  if (!fbInitialised) {
    return <span>Loading</span>
  }

  return <AuthContext.Provider value={{ login, logout, user }} {...props} />
}

const useAuth = () => useContext(AuthContext)

export { AuthContext, AuthProvider, useAuth }
