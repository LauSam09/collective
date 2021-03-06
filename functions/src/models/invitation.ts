import admin = require("firebase-admin")

export interface Invitation {
  inviter: {
    id: string
    name: string
  }
  group: {
    id: string
    name: string
  }
  created: admin.firestore.Timestamp // TODO add type to user as well
}
