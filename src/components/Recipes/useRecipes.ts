import { useContext, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import firebase from "firebase"

import { Recipe } from "models"
import { AuthenticationContext } from "authentication/AuthenticationContext"
import {
  addRecipe as addRecipeAction,
  editRecipe as editRecipeAction,
  deleteRecipe as deleteRecipeAction,
} from "store/actions"
import { RootState } from "store/reducers"

export default function useRecipes() {
  const dispatch = useDispatch()
  const db = firebase.firestore()
  const recipes = useSelector((state: RootState) => state.recipeState.recipes)
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
                // Every time recipes re-renders, this hook is fired, and items are re-added.
                if (!recipes.filter((r) => r.id === recipe.id).length) {
                  dispatch(addRecipeAction(recipe))
                }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
