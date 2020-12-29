import { Recipe } from "models"
import {
  ADD_RECIPE,
  DELETE_RECIPE,
  EDIT_RECIPE,
  FETCH_RECIPES,
  RecipeActionTypes,
  SET_RECIPE_DAYS,
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

    case SET_RECIPE_DAYS:
      return {
        ...state,
        recipes: state.recipes.map((recipe) =>
          recipe.id === action.payload.id
            ? { ...recipe, days: action.payload.days }
            : recipe
        ),
      }

    case FETCH_RECIPES:
      return {
        ...state,
        recipes: action.payload,
      }

    default:
      return state
  }
}
