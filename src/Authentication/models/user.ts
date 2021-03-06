import firebase from "firebase/app"

export enum UserState {
  Unregistered = "Unregistered",
  Registered = "Registered",
}

/** The object exposed by firebase authentication */
export interface AuthUser {
  id: string
  email: string
  name?: string
}

/**
 * The object stored in the database
 */
export interface DatabaseUser {
  name: string
  added: firebase.firestore.Timestamp
  email: string
  state: UserState
  group?: UserGroup
}

/**
 * The object used throughout the application
 */
export interface User {
  id: string
  name: string
  state: UserState
  group?: UserGroup
}

/** The nested group data stored on a user */
export interface UserGroup {
  id: string
  name: string
  defaultList: string
}
