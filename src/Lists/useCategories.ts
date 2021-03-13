import { useEffect, useState } from "react"
import firebase from "firebase/app"
import "firebase/firestore"

import { useGroup } from "Authentication"
import { Category } from "./models"

const db = firebase.firestore()

export function useCategories() {
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

  return { categories }
}
