import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import { env } from "process"
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"

import { AuthUser } from "./models"

import fbConfig from "Config/firebase.json"
import { FullPageSpinner } from "Common"

const googleProvider = new firebase.auth.GoogleAuthProvider()

firebase.initializeApp(fbConfig)

if (env.NODE_ENV !== "test") {
  firebase.firestore().enablePersistence({ synchronizeTabs: true })
}

type AuthContextType = {
  login: () => Promise<void>
  logout: () => Promise<void>
  user?: AuthUser
}

const AuthContext = createContext<Partial<AuthContextType>>({})

type AuthProviderProps = {
  children?: ReactNode
}

function AuthProvider(props: AuthProviderProps) {
  const [fbInitialised, setFbInitialised] = useState(false)
  const [user, setUser] = useState<AuthUser>()

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser({
          id: user.uid,
          name: user.displayName ?? undefined,
          email: user.email || "",
        })
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
    return <FullPageSpinner />
  }

  return <AuthContext.Provider value={{ login, logout, user }} {...props} />
}

const useAuth = () => useContext(AuthContext)
const useIsAuthenticated = () => Boolean(useContext(AuthContext).user)

export { AuthContext, AuthProvider, useAuth, useIsAuthenticated }
