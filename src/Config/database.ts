import firebase from "firebase/app"
import "firebase/firestore"

import fbConfig from "./firebase.json"

firebase.initializeApp(fbConfig)
firebase.firestore().enablePersistence({ synchronizeTabs: true })

export const db = firebase.firestore()
