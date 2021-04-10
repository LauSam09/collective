import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"

import { Category } from "./models"
import { useGroup } from "Authentication"
import { db } from "Config"
import { FullPageSpinner } from "Common"

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
  const [categories, setCategories] = useState<Category[]>()

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

  if (!categories) {
    return <FullPageSpinner />
  }

  return (
    <CategoriesContext.Provider value={{ categories: categories ?? [] }}>
      {props.children}
    </CategoriesContext.Provider>
  )
}

export const useCategoriesContext = () => useContext(CategoriesContext)
export const useCategories = () => useCategoriesContext().categories
