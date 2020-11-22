import { Recipe } from "models"

export const ADD_RECIPE = "ADD_RECIPE"

interface AddRecipeAction {
  type: typeof ADD_RECIPE
  payload: Recipe
}

export type RecipeActionTypes = AddRecipeAction

export function addRecipe(recipe: Recipe): AddRecipeAction {
  return {
    type: ADD_RECIPE,
    payload: recipe,
  }
}
