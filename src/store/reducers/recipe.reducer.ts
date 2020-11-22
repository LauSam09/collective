import { Recipe } from "models"
import { ADD_RECIPE, RecipeActionTypes } from "store/actions"

type RecipeState = {
  recipes: Recipe[]
}

const initialState: RecipeState = {
  recipes: [],
}

export default function (state = initialState, action: RecipeActionTypes) {
  switch (action.type) {
    case ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload],
      }

    default:
      return state
  }
}
