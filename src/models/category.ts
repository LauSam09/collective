import { Item } from "./item"

export interface Category {
  id: string
  colour: string
  name: string
  order: number
  items: Array<Item>
}
