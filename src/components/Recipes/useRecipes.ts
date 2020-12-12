import { useContext, useEffect } from "react"
import { useDispatch } from "react-redux"
import firebase from "firebase"

import { Recipe } from "models"
import { AuthenticationContext } from "authentication/AuthenticationContext"
import {
  addRecipe as addRecipeAction,
  editRecipe as editRecipeAction,
  deleteRecipe as deleteRecipeAction,
} from "store/actions"

export default function useRecipes() {
  const dispatch = useDispatch()
  const db = firebase.firestore()
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
                  recipeUrl: data.recipeUrl,
                }
                dispatch(addRecipeAction(recipe))
              }

              break
            }

            case "modified":
              dispatch(
                editRecipeAction({
                  ...change.doc.data(),
                  id: change.doc.id,
                } as Recipe)
              )
              break
            case "removed":
              dispatch(deleteRecipeAction(change.doc.id))
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

  return { addRecipe, deleteRecipe, setDay, updateRecipe }
}
