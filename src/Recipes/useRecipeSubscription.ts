import { useEffect, useState } from "react"

import { Recipe } from "./models"
import { db } from "Config"
import { useGroup } from "Authentication"

export function useRecipeSubscription() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const { id } = useGroup() || {}

  if (!id) {
    throw new Error("Group not defined for user.")
  }

  useEffect(() => {
    const unsubscribe = db
      .collection("groups")
      .doc(id)
      .collection("recipes")
      .onSnapshot((snapshot) => {
        const addedRecipes: Recipe[] = []
        snapshot.docChanges().forEach((change) => {
          const item = { ...change.doc.data(), id: change.doc.id } as Recipe
          switch (change.type) {
            case "added": {
              addedRecipes.push(item)
              break
            }
            case "modified": {
              setRecipes((old) => old.map((i) => (i.id === item.id ? item : i)))
              break
            }
            case "removed": {
              setRecipes((old) => old.filter((i) => i.id !== item.id))
              break
            }
          }
        })
        setRecipes((old) => [...old, ...addedRecipes])
      })

    return () => {
      unsubscribe()
    }
  }, [id])

  return { recipes }
}
