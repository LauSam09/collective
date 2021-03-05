export interface Group {
  name: string
  defaultList: string
  users: string[]
  userDetails: {
    id: string
    name: string
  }[]
}
