import { useCallback, useContext, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import firebase from "firebase/app"

import { Recipe } from "models"
import { AuthenticationContext } from "authentication"
import {
  addRecipe as addRecipeAction,
  editRecipe as editRecipeAction,
  deleteRecipe as deleteRecipeAction,
  setRecipeDays,
  fetchRecipes,
} from "store"

export default function useRecipes() {
  const dispatch = useDispatch()
  const db = firebase.firestore()
  const { group } = useContext(AuthenticationContext)
  const [loading, setLoading] = useState(true)

  const getRecipesCollection = useCallback(
    () => db.collection("groups").doc(group?.id).collection("recipes"),
    [group, db]
  )

  useEffect(() => {
    if (!group) {
      setLoading(false)
      return
    }

    getRecipesCollection()
      .get()
      .then((querySnapshot) => {
        dispatch(
          fetchRecipes(
            querySnapshot.docs.map(
              (doc) => ({ ...doc.data(), id: doc.id } as Recipe)
            )
          )
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }, [dispatch, getRecipesCollection, group])

  async function addRecipe(recipe: Recipe) {
    const { id, ...sanitisedItem } = recipe
    sanitisedItem.name = sanitisedItem.name.trim()
    const documentRef = await getRecipesCollection().add(sanitisedItem)
    dispatch(addRecipeAction({ ...sanitisedItem, id: documentRef.id }))
  }

  async function deleteRecipe(id: string) {
    await getRecipesCollection().doc(id).delete()
    dispatch(deleteRecipeAction(id))
  }

  async function setDay(id: string, day?: number) {
    const days = day === undefined || day === -1 ? [] : [day]
    await getRecipesCollection().doc(id).update({
      days,
    })
    dispatch(setRecipeDays(id, days))
  }

  async function updateRecipe(recipe: Recipe) {
    const { id, ...sanitisedItem } = recipe
    sanitisedItem.name = sanitisedItem.name.trim()
    await getRecipesCollection().doc(id).update(sanitisedItem)
    dispatch(editRecipeAction({ ...sanitisedItem, id }))
  }

  return { addRecipe, deleteRecipe, setDay, updateRecipe, loading }
}
