import { useContext, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import firebase from "firebase"

import { Recipe } from "models"
import { AuthenticationContext } from "authentication/AuthenticationContext"
import { addRecipe as addRecipeAction } from "store/actions"

export default function useRecipes() {
  const dispatch = useDispatch()
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
            case "added": {
              // When collection is empty, a document with only an id is being added - unsure why
              if (change.doc.data().name) {
                const data = change.doc.data()
                const recipe: Recipe = {
                  id: change.doc.id,
                  name: data.name,
                  days: data.days,
                }
                setRecipes((recipes) => [...recipes, recipe])
                dispatch(addRecipeAction(recipe))
              }

              break
            }

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
  }, [group, db, dispatch])

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
        days: day === undefined ? [] : [day],
      })
  }

  async function updateRecipe(recipe: Recipe) {
    const { id, ...sanitisedItem } = recipe
    sanitisedItem.name = sanitisedItem.name.trim()
    await getRecipesCollection().doc(id).update(sanitisedItem)
  }

  return { recipes, addRecipe, deleteRecipe, setDay, updateRecipe }
}
