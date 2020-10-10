import { useContext, useEffect, useState } from "react"
import firebase from "firebase"

import { Recipe } from "models"
import { AuthenticationContext } from "authentication/AuthenticationContext"

export default function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const { group } = useContext(AuthenticationContext)

  useEffect(() => {
    if (!group) {
      return
    }

    const db = firebase.firestore()

    const unsubscribe = db
      .collection("groups")
      .doc(group?.id)
      .collection("recipes")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          switch (change.type) {
            case "added":
              setRecipes((recipes) => [
                ...recipes,
                { ...change.doc.data(), id: change.doc.id } as Recipe,
              ])
              break
            case "modified":
              setRecipes((recipes) =>
                recipes.map((recipe) => {
                  if (recipe.id === change.doc.id) {
                    return { ...change.doc.data(), id: change.doc.id } as Recipe
                  } else {
                    return recipe
                  }
                })
              )
              break
            case "removed":
              setRecipes((recipes) =>
                recipes.filter((recipe) => recipe.id !== change.doc.id)
              )
              break
          }
        })
      })

    return () => {
      unsubscribe()
    }
  }, [group])

  async function addRecipe(recipe: Recipe) {
    const db = firebase.firestore()

    const { id, ...sanitisedItem } = recipe
    sanitisedItem.name = sanitisedItem.name.trim()

    await db
      .collection("groups")
      .doc(group?.id)
      .collection("recipes")
      .add(sanitisedItem)
  }

  async function deleteRecipe(id: string) {
    const db = firebase.firestore()

    await db
      .collection("groups")
      .doc(group?.id)
      .collection("recipes")
      .doc(id)
      .delete()
  }

  async function setDay(id: string, day?: number) {
    const db = firebase.firestore()

    await db
      .collection("groups")
      .doc(group?.id)
      .collection("recipes")
      .doc(id)
      .update({
        day: day === undefined ? firebase.firestore.FieldValue.delete() : day,
      })
  }

  return { recipes, addRecipe, deleteRecipe, setDay }
}
