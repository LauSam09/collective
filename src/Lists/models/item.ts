export interface Item {
  id: string
  added: boolean
  completed: boolean
  category: string
  name: string
  lowerName: string
  notes: string | undefined
  count: number | undefined
}

export interface DatabaseItem {
  added: boolean
  completed: boolean
  category: string
  name: string
  lowerName: string
  notes: string | undefined
  count: number | undefined
}
