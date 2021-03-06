export interface Item {
  added: boolean
  completed: boolean
  category: string
  name: string
  lowerName: string
  notes: string | undefined
  count: number | undefined
}