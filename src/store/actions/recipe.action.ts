import { Recipe } from "models"

export const ADD_RECIPE = "ADD_RECIPE"
export const EDIT_RECIPE = "EDIT_RECIPE"
export const DELETE_RECIPE = "DELETE_RECIPE"

interface AddRecipeAction {
  type: typeof ADD_RECIPE
  payload: Recipe
}

interface EditRecipeAction {
  type: typeof EDIT_RECIPE
  payload: Recipe
}

interface DeleteRecipeAction {
  type: typeof DELETE_RECIPE
  payload: string
}

export type RecipeActionTypes =
  | AddRecipeAction
  | EditRecipeAction
  | DeleteRecipeAction

export function addRecipe(recipe: Recipe): AddRecipeAction {
  return {
    type: ADD_RECIPE,
    payload: recipe,
  }
}

export function editRecipe(recipe: Recipe): EditRecipeAction {
  return {
    type: EDIT_RECIPE,
    payload: recipe,
  }
}

export function deleteRecipe(id: string): DeleteRecipeAction {
  return {
    type: DELETE_RECIPE,
    payload: id,
  }
}
