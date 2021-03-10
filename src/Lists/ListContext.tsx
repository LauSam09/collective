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
import { useGroup } from "Authentication"

const db = firebase.firestore()

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
  const { defaultList, id } = useGroup() || {}
  const [addedItems, setAddedItems] = useState<Item[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  if (!defaultList || !id) {
    throw new Error("Group not defined for user.")
  }

  useEffect(() => {
    const unsubscribe = db
      .collection("groups")
      .doc(id)
      .collection("lists")
      .doc(defaultList)
      .collection("items")
      .onSnapshot((snapshot) => {
        const items: Item[] = []
        snapshot.docChanges().forEach((change) => {
          const { added, ...rest } = change.doc.data()
          switch (change.type) {
            case "added": {
              added &&
                items.push({
                  ...rest,
                  completed: !!rest.completed,
                  id: change.doc.id,
                } as Item)
              break
            }
          }
        })
        setAddedItems(items)
      })

    return () => {
      unsubscribe()
    }
  }, [defaultList, id])

  return (
    <ListContext.Provider value={{ addedItems, categories }}>
      {props.children}
    </ListContext.Provider>
  )
}

const fakeItems = [
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
    name: "Lemons",
    lowerName: "lemons",
    category: "1",
    count: 1,
    notes: "x3",
    added: true,
    completed: true,
  },
  {
    name: "Eggs",
    lowerName: "eggs",
    category: "2",
    count: 2,
    notes: undefined,
    added: true,
    completed: true,
  },
  {
    name: "Chocolate",
    lowerName: "chocolate",
    category: "",
    count: 2,
    notes: undefined,
    added: true,
    completed: true,
  },
  {
    name: "Frozen peas",
    lowerName: "frozen peas",
    category: "3",
    count: 3,
    notes: "Fischer",
    added: true,
    completed: false,
  },
]

const fakeCategories = [
  {
    id: "1",
    name: "Fruit & Vegetables",
    colour: "#74ac72",
    order: 0,
  },
  {
    id: "2",
    name: "Dairy",
    colour: "#fcf403",
    order: 1,
  },
  {
    id: "3",
    name: "Frozen",
    colour: "#0384fc",
    order: 3,
  },
]

export const useListContext = () => useContext(ListContext)
export const useListItems = () => useListContext().addedItems
export const useListCategories = () => useListContext().categories
