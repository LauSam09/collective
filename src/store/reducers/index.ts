import { combineReducers } from "redux"

import recipeReducer from "./recipe.reducer"
import listReducer from "./list.reducer"
import categoryReducer from "./category.reducer"

const rootReducer = combineReducers({
  recipeState: recipeReducer,
  listState: listReducer,
  categoryState: categoryReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
