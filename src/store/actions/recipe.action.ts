import { Recipe } from "models"

export const ADD_RECIPE = "ADD_RECIPE"
export const EDIT_RECIPE = "EDIT_RECIPE"
export const DELETE_RECIPE = "DELETE_RECIPE"
export const SET_RECIPE_DAYS = "SET_RECIPE_DAY"
export const FETCH_RECIPES = "FETCH_RECIPES"

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

interface SetRecipeDaysAction {
  type: typeof SET_RECIPE_DAYS
  payload: {
    id: string
    days: number[]
  }
}

interface FetchRecipesAction {
  type: typeof FETCH_RECIPES
  payload: Recipe[]
}

export type RecipeActionTypes =
  | AddRecipeAction
  | EditRecipeAction
  | DeleteRecipeAction
  | SetRecipeDaysAction
  | FetchRecipesAction

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

export function setRecipeDays(id: string, days: number[]): SetRecipeDaysAction {
  return {
    type: SET_RECIPE_DAYS,
    payload: {
      id,
      days,
    },
  }
}

export function fetchRecipes(recipes: Recipe[]): FetchRecipesAction {
  return {
    type: FETCH_RECIPES,
    payload: recipes,
  }
}
