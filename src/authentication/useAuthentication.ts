import { useEffect, useState } from 'react'
import firebase from 'firebase'

import { UserState } from '../models'

const googleProvider = new firebase.auth.GoogleAuthProvider()

export default function useAuthentication() {
  const [initialised, setInitialised] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [userState, setUserState] = useState<UserState>()

  useEffect(() => {
    firebase.initializeApp({
      apiKey: 'AIzaSyCOeOpy_At3rf4OIkJndZIzUnNUIDrLfe4',
      authDomain: 'collective-35e56.firebaseapp.com',
      projectId: 'collective-35e56'
    })

    firebase.firestore().enablePersistence()

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setAuthenticated(true)
      } else {
        setAuthenticated(false)
      }
    })

    setInitialised(true)

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!authenticated) {
      setUserState(undefined)
      return
    }

    const db = firebase.firestore()
    var user = firebase.auth().currentUser

    db.collection('users').doc(user?.uid).get()
      .then(doc => {
        if (doc.exists) {
          setUserState(UserState.Existing)
        } else {
          setUserState(UserState.New)
          db.collection('users').doc(user?.uid).set({
            added: new Date()
          })
        }
      })
  }, [authenticated])

  async function login() {
    firebase.auth().signInWithPopup(googleProvider)
  }

  async function logout() {
    firebase.auth().signOut()
  }

  return { initialised, authenticated, userState, login, logout }
}
