import { useEffect, useState } from "react"
import firebase from "firebase"

const googleProvider = new firebase.auth.GoogleAuthProvider()

export default function useAuthentication() {
  const [initialised, setInitialised] = useState(false)
  const [initialisationDelay, setInitialisationDelay] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    firebase.initializeApp({
      apiKey: "AIzaSyCOeOpy_At3rf4OIkJndZIzUnNUIDrLfe4",
      authDomain: "collective-35e56.firebaseapp.com",
      projectId: "collective-35e56",
    })

    firebase.firestore().enablePersistence()

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setAuthenticated(true)
      } else {
        setAuthenticated(false)
      }
    })
    setTimeout(() => {
      setInitialisationDelay(true)
    }, 1000)

    setInitialised(true)

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
    initialised: initialisationDelay && initialised,
    authenticated,
    login,
    logout,
  }
}
