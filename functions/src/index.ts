import * as functions from "firebase-functions"

import admin = require("firebase-admin")
admin.initializeApp()

interface Group {
  name: string
  defaultList: string
  users: string[]
  userDetails: {
    id: string
    name: string
  }[]
}

// TODO add name when creating user
interface User {
  name: string
}

export const joinHousehold = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
    )
  }

  const { uid } = context.auth
  const { groupId } = data

  const groupDoc = await admin
    .firestore()
    .collection("groups")
    .doc(groupId)
    .get()
  if (!groupDoc.exists) {
    throw new functions.https.HttpsError(
      "not-found",
      "Household specified does not exist."
    )
  }

  // TODO add defaultList when creating group
  const group = groupDoc.data() as Group
  if (group.users.find((u) => u === uid)) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Already member of household."
    )
  }

  const userDoc = await admin.firestore().collection("users").doc(uid).get()
  if (!userDoc.exists) {
    throw new functions.https.HttpsError("not-found", "User does not exist.")
  }

  const user = userDoc.data() as User

  await admin
    .firestore()
    .collection("groups")
    .doc(groupId)
    .update({
      users: [...group.users, uid],
      userDetails: [...group.userDetails, { id: uid, name: user.name }],
    })

  await admin
    .firestore()
    .collection("users")
    .doc(uid)
    .update({
      group: {
        id: groupId,
        name: group.name,
        defaultList: group.defaultList,
      },
    })

  return 0
})
