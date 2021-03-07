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

import { Item } from "./models"

type ListContextType = {
  addedItems: Item[]
}

export const ListContext = createContext<ListContextType>({
  addedItems: [],
})

type ListContextProviderProps = {
  children?: ReactNode
}

export function ListContextProvider(props: ListContextProviderProps) {
  const [addedItems, setAddedItems] = useState<Item[]>([
    {
      name: "Spinach",
      lowerName: "spinach",
      category: "Fruit and Veg",
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

  return (
    <ListContext.Provider value={{ addedItems }}>
      {props.children}
    </ListContext.Provider>
  )
}

export const useListContext = () => useContext(ListContext)
export const useListItems = () => useListContext().addedItems
