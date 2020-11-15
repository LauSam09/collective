import { useContext, useEffect, useState } from "react"
import firebase from "firebase"

import { Recipe } from "models"
import { AuthenticationContext } from "authentication/AuthenticationContext"

export default function useRecipes() {
  const db = firebase.firestore()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const { group } = useContext(AuthenticationContext)

  const getRecipesCollection = () =>
    db.collection("groups").doc(group?.id).collection("recipes")

  useEffect(() => {
    if (!group) {
      return
    }

    const unsubscribe = db
      .collection("groups")
      .doc(group?.id)
      .collection("recipes")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          switch (change.type) {
            case "added":
              // When collection is empty, a document with only an id is being added - unsure why
              change.doc.data().name &&
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
  }, [group, db])

  async function addRecipe(recipe: Recipe) {
    const { id, ...sanitisedItem } = recipe
    sanitisedItem.name = sanitisedItem.name.trim()
    await getRecipesCollection().add(sanitisedItem)
  }

  async function deleteRecipe(id: string) {
    await getRecipesCollection().doc(id).delete()
  }

  async function setDay(id: string, day?: number) {
    await getRecipesCollection()
      .doc(id)
      .update({
        day: day === undefined ? firebase.firestore.FieldValue.delete() : day,
      })
  }

  async function updateRecipe(recipe: Recipe) {
    const { id, ...sanitisedItem } = recipe
    sanitisedItem.name = sanitisedItem.name.trim()
    await getRecipesCollection().doc(id).update(sanitisedItem)
  }

  return { recipes, addRecipe, deleteRecipe, setDay, updateRecipe }
}
