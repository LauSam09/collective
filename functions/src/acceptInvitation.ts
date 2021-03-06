import * as functions from "firebase-functions"
import admin = require("firebase-admin")

import { Invitation, Group, User } from "./models"

export const acceptInvitation = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called while authenticated."
      )
    }

    const { uid } = context.auth
    const { inviteId } = data

    const inviteDoc = await admin
      .firestore()
      .collection("invites")
      .doc(inviteId)
      .get()

    if (!inviteDoc.exists) {
      throw new functions.https.HttpsError("not-found", "Invitation not found.")
    }

    const invite = inviteDoc.data() as Invitation

    const hourInSeconds = 60 * 60
    if (
      admin.firestore.Timestamp.now().seconds - invite.created.seconds >
      hourInSeconds
    ) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Invitation has expired."
      )
    }

    const groupDoc = await admin
      .firestore()
      .collection("groups")
      .doc(invite.group.id)
      .get()
    if (!groupDoc.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "Household specified does not exist."
      )
    }

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
      .doc(invite.group.id)
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
          id: invite.group.id,
          name: group.name,
          defaultList: group.defaultList,
        },
        state: "Registered",
      })

    await admin.firestore().collection("invites").doc(inviteId).delete()
  }
)
