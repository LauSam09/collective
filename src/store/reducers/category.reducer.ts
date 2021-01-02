import { CategoryActionTypes, GET_CATEGORIES, ListCategory } from "../actions"

interface CategoryState {
  categories: ListCategory[]
}

const initialState: CategoryState = {
  categories: [],
}

export default function (
  state = initialState,
  action: CategoryActionTypes
): CategoryState {
  switch (action.type) {
    case GET_CATEGORIES: {
      return {
        ...state,
        categories: action.payload,
      }
    }
    default:
      return { ...state }
  }
}
