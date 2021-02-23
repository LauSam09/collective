import firebase from "firebase/app"
import "firebase/firestore"

import { Group } from "Authentication"

const db = firebase.firestore()

export async function createGroup(group: Group) {
  const doc = await db.collection("groups").add(group)
  // TODO add list collection so we can add default list id below
  await db
    .collection("users")
    .doc(group.users[0])
    .update({
      group: {
        id: doc.id,
        name: group.name,
      },
    })
}
