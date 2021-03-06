import * as functions from "firebase-functions"
import admin = require("firebase-admin")

import { Invitation } from "./models"

export const createInvitation = functions.https.onCall(
  async (data, context) => {
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

    const group = groupDoc.data() as {
      name: string
      userDetails: {
        id: string
        name: string
      }[]
    }

    const groupUser = group.userDetails.find((u) => u.id === uid)

    if (!groupUser) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "You are not a member of this household."
      )
    }

    const invite: Invitation = {
      inviter: { id: groupUser.id, name: groupUser.name },
      group: {
        id: groupId,
        name: group.name,
      },
      created: admin.firestore.FieldValue.serverTimestamp() as admin.firestore.Timestamp,
    }

    const inviteDoc = await admin.firestore().collection("invites").add(invite)

    return inviteDoc.id
  }
)
