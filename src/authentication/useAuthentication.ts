import { useEffect, useState } from "react"
import firebase from "firebase"
import LogRocket from "logrocket"

const googleProvider = new firebase.auth.GoogleAuthProvider()

export default function useAuthentication() {
  const [initialised, setInitialised] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    firebase.initializeApp({
      apiKey: "AIzaSyCOeOpy_At3rf4OIkJndZIzUnNUIDrLfe4",
      authDomain: "collective-35e56.firebaseapp.com",
      projectId: "collective-35e56",
    })

    firebase.firestore().enablePersistence({ synchronizeTabs: true })

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setAuthenticated(true)
        if (process.env.NODE_ENV === "production") {
          LogRocket.identify(user.uid, {
            name: user.displayName || "No display name",
            email: user.email || "No email address",
          })
        }
      } else {
        setAuthenticated(false)
      }
      setInitialised(true)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  async function login() {
    firebase.auth().signInWithPopup(googleProvider)
  }

  async function logout() {
    firebase.auth().signOut()
  }

  return {
    initialised,
    authenticated,
    login,
    logout,
  }
}
