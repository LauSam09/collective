import { useEffect, useState } from "react"

import { useUserContext } from "Authentication"

import { RecipeModel } from "./models"

export function useRecipeSubscription() {
  const [recipes, setRecipes] = useState<RecipeModel[]>([])
  const { getRecipesCollection } = useUserContext()

  useEffect(() => {
    const unsubscribe = getRecipesCollection().onSnapshot((snapshot) => {
      const addedRecipes: RecipeModel[] = []
      snapshot.docChanges().forEach((change) => {
        const item = { ...change.doc.data(), id: change.doc.id } as RecipeModel
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
  }, [getRecipesCollection])

  recipes.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))

  return { recipes }
}
