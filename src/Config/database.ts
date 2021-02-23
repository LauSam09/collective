import { env } from "process"
import firebase from "firebase/app"

import fbConfig from "Config/firebase.json"

firebase.initializeApp(fbConfig)

if (env.NODE_ENV !== "test") {
  firebase.firestore().enablePersistence({ synchronizeTabs: true })
}
