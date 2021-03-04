export enum UserState {
  Unregistered = "Unregistered",
  Registered = "Registered",
}

/** The object exposed by firebase authentication */
export interface AuthUser {
  id: string
  email: string
  displayName?: string
}

/**
 * The object stored in the database
 */
export interface DatabaseUser {
  added: any // Timestamp
  email: string
  state: UserState
  group?: UserGroup
}

/**
 * The object used throughout the application
 */
export interface User {
  id: string
  displayName: string
  state: UserState
  group?: UserGroup
}

/** The nested group data stored on a user */
export interface UserGroup {
  id: string
  name: string
  defaultList: string
}
