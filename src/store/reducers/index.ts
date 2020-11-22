import { combineReducers } from "redux"

import recipeReducer from "./recipe.reducer"

const rootReducer = combineReducers({
  recipeState: recipeReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
