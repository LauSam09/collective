export interface Item {
  id: string
  added: boolean
  completed: boolean
  category: string
  name: string
  lowerName: string
  notes?: string
  count?: number
  flagged?: boolean
}

export interface DatabaseItem {
  added: boolean
  completed: boolean
  category: string
  name: string
  lowerName: string
  notes?: string
  count?: number
  flagged?: boolean
}
