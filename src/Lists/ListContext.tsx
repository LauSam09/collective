import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import firebase from "firebase/app"
import "firebase/firestore"

import { Category, Item } from "./models"

type ListContextType = {
  addedItems: Item[]
  categories: Category[]
}

export const ListContext = createContext<ListContextType>({
  addedItems: [],
  categories: [],
})

type ListContextProviderProps = {
  children?: ReactNode
}

export function ListContextProvider(props: ListContextProviderProps) {
  const [addedItems, setAddedItems] = useState<Item[]>([
    {
      name: "Spinach",
      lowerName: "spinach",
      category: "1",
      count: 2,
      notes: "Young leaf",
      added: true,
      completed: false,
    },
    {
      name: "Eggs",
      lowerName: "eggs",
      category: "Dairy",
      count: 2,
      notes: undefined,
      added: true,
      completed: true,
    },
  ])
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Fruit & Vegetables",
      colour: "#74ac72",
      order: 0,
    },
  ])

  return (
    <ListContext.Provider value={{ addedItems, categories }}>
      {props.children}
    </ListContext.Provider>
  )
}

export const useListContext = () => useContext(ListContext)
export const useListItems = () => useListContext().addedItems
export const useListCategories = () => useListContext().categories
