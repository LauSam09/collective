import { createContext, ReactNode, useEffect, useState } from "react"
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from "firebase/auth"
import { logEvent } from "firebase/analytics"
import { doc, getDoc } from "firebase/firestore"

import useFirebase from "../hooks/useFirebase"

type AuthenticationState = "Loading" | "Authenticated" | "Unauthenticated"

type Authentication = {
  state: AuthenticationState
  user: User | undefined
  appUser: AppUser | undefined
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

interface AppUser {
  id: string
  name: string
  email: string
  group: {
    id: string
    name: string
    defaultList: string
  }
}

export const AuthenticationContext = createContext<Authentication>({
  state: "Loading",
  user: undefined,
  appUser: undefined,
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
})

type AuthenticationContextProviderProps = {
  children: ReactNode
}

export const AuthenticationProvider = (
  props: AuthenticationContextProviderProps,
) => {
  const { children } = props
  const [state, setState] = useState<AuthenticationState>("Loading")
  const [user, setUser] = useState<User>()
  const [appUser, setAppUser] = useState<AppUser>()
  const { app, analytics, firestore } = useFirebase()

  useEffect(() => {
    async function handleAuthStateChanged(user: User | null) {
      if (user) {
        const docRef = doc(firestore, "users", user.uid)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const appUser = { ...docSnap.data(), id: docSnap.id } as AppUser
          setAppUser(appUser)
        } else {
          throw new Error("Unregistered users are not currently supported")
        }

        setState("Authenticated")
      } else {
        setState("Unauthenticated")
      }

      setUser(user ?? undefined)
    }

    if (!app) {
      return
    }

    const auth = getAuth()

    const unsubscribe = auth.onAuthStateChanged(handleAuthStateChanged)

    return () => {
      unsubscribe()
    }
  }, [app])

  const signIn = async () => {
    const auth = getAuth()
    const provider = new GoogleAuthProvider()

    try {
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error(error)
    }

    logEvent(analytics, "login", { method: "Google" })
  }

  const signOut = async () => {
    const auth = getAuth()

    try {
      await auth.signOut()
    } catch (error) {
      console.error(error)
    }

    logEvent(analytics, "logout")
  }

  return (
    <AuthenticationContext.Provider
      value={{ state, user, appUser, signIn, signOut }}
    >
      {children}
    </AuthenticationContext.Provider>
  )
}
