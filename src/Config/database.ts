import firebase from "firebase/app"

import fbConfig from "Config/firebase.json"

firebase.initializeApp(fbConfig)
// firebase.firestore().enablePersistence({ synchronizeTabs: true })
