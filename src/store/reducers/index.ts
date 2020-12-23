import { combineReducers } from "redux"

import recipeReducer from "./recipe.reducer"
import listReducer from "./list.reducer"

const rootReducer = combineReducers({
  recipeState: recipeReducer,
  listState: listReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
