export interface User {
  id: string
  displayName?: string
  group?: {
    id: string
    name: string
    defaultList: string
  }
}

export interface UserGroup {
  id: string
  name: string
  defaultList: string
}
