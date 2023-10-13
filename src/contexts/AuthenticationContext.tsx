import { createContext, ReactNode, useEffect, useState } from "react"
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from "firebase/auth"

import useFirebase from "../hooks/useFirebase"
import { logEvent } from "firebase/analytics"

type AuthenticationState = "Loading" | "Authenticated" | "Unauthenticated"

type Authentication = {
  state: AuthenticationState
  user: User | undefined
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

export const AuthenticationContext = createContext<Authentication>({
  state: "Loading",
  user: undefined,
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
  const { app, analytics } = useFirebase()

  useEffect(() => {
    if (!app) {
      return
    }

    const auth = getAuth()

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setState("Authenticated")
      } else {
        setState("Unauthenticated")
      }

      setUser(user ?? undefined)
    })

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
    <AuthenticationContext.Provider value={{ state, user, signIn, signOut }}>
      {children}
    </AuthenticationContext.Provider>
  )
}
