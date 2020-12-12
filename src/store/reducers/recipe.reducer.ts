import { Recipe } from "models"
import {
  ADD_RECIPE,
  DELETE_RECIPE,
  EDIT_RECIPE,
  RecipeActionTypes,
} from "store/actions"

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

    case EDIT_RECIPE:
      return {
        ...state,
        recipes: state.recipes.map((recipe) =>
          recipe.id === action.payload.id ? action.payload : recipe
        ),
      }

    case DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter((recipe) => recipe.id !== action.payload),
      }

    default:
      return state
  }
}
