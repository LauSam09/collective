import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import firebase from "firebase/app"
import "firebase/firestore"

import { Category } from "./models"
import { useGroup } from "Authentication"

const db = firebase.firestore()

type CategoriesContextType = {
  categories: Category[]
}

export const CategoriesContext = createContext<CategoriesContextType>({
  categories: [],
})

type CategoriesContextProviderProps = {
  children?: ReactNode
}

export function CategoriesContextProvider(
  props: CategoriesContextProviderProps
) {
  const { defaultList, id } = useGroup() || {}
  const [categories, setCategories] = useState<Category[]>([])

  if (!defaultList || !id) {
    throw new Error("Group not defined for user.")
  }

  useEffect(() => {
    db.collection("groups")
      .doc(id)
      .collection("lists")
      .doc(defaultList)
      .collection("categories")
      .get()
      .then((querySnapshot) => {
        setCategories(
          querySnapshot.docs.map(
            (doc) => ({ ...doc.data(), id: doc.id } as Category)
          )
        )
      })
  }, [defaultList, id])

  return (
    <CategoriesContext.Provider value={{ categories }}>
      {props.children}
    </CategoriesContext.Provider>
  )
}

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

export const useCategoriesContext = () => useContext(CategoriesContext)
export const useCategories = () => useCategoriesContext().categories
