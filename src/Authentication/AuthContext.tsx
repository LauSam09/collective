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

import { AuthUser } from "./models"

const googleProvider = new firebase.auth.GoogleAuthProvider()

type AuthContextType = {
  login: () => Promise<void>
  logout: () => Promise<void>
  user: AuthUser | undefined
  initialised: boolean
}

const AuthContext = createContext<Partial<AuthContextType>>({})

type AuthProviderProps = {
  children?: ReactNode
}

function AuthProvider(props: AuthProviderProps) {
  const [initialised, setFbInitialised] = useState(false)
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

  return (
    <AuthContext.Provider
      value={{ login, logout, user, initialised }}
      {...props}
    />
  )
}

const useAuth = () => useContext(AuthContext)
const useIsAuthenticated = () => Boolean(useContext(AuthContext).user)

export { AuthContext, AuthProvider, useAuth, useIsAuthenticated }
