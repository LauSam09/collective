import { useContext, useEffect, useState } from "react"
import firebase from "firebase"

import { Recipe } from "models"
import { AuthenticationContext } from "authentication/AuthenticationContext"

export default function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const { group } = useContext(AuthenticationContext)

  useEffect(() => {
    if (group) {
      const db = firebase.firestore()
      db.collection("groups")
        .doc(group.id)
        .collection("recipes")
        .get()
        .then((querySnapshot) => {
          setRecipes(
            querySnapshot.docs.map(
              (doc) => ({ ...doc.data(), id: doc.id } as Recipe)
            )
          )
        })
    } else {
      setRecipes([])
    }
  }, [group])

  async function addRecipe(recipe: Recipe) {
    const db = firebase.firestore()

    const { id, ...sanitisedItem } = recipe
    sanitisedItem.name = sanitisedItem.name.trim()

    const doc = await db
      .collection("groups")
      .doc(group?.id)
      .collection("recipes")
      .add(sanitisedItem)

    setRecipes((recipes) => [...recipes, { ...sanitisedItem, id: doc.id }])
  }

  async function deleteRecipe(id: string) {
    const db = firebase.firestore()

    await db
      .collection("groups")
      .doc(group?.id)
      .collection("recipes")
      .doc(id)
      .delete()

    setRecipes((recipes) => recipes.filter((recipe) => recipe.id !== id))
  }

  return { recipes, addRecipe, deleteRecipe }
}
