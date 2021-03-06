import firebase from "firebase/app"

export interface Invitation {
  inviter: {
    id: string
    name: string
  }
  group: {
    id: string
    name: string
  }
  created: firebase.firestore.Timestamp // TODO add type to user as well
}
