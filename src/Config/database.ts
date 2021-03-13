import firebase from "firebase/app"
import "firebase/firestore"
import { env } from "process"

import fbConfig from "./firebase.json"

firebase.initializeApp(fbConfig)

if (env.NODE_ENV !== "test") {
  firebase.firestore().enablePersistence({ synchronizeTabs: true })
}

export const db = firebase.firestore()
