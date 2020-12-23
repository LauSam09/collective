import { ListItem, ListActionTypes, UPSERT_ITEM } from "../actions"

type ListState = {
  items: ListItem[]
}

const initialState: ListState = {
  items: [],
}

export default function (state = initialState, action: ListActionTypes) {
  switch (action.type) {
    case UPSERT_ITEM: {
      if (
        state.items.filter(
          (i) =>
            i.id === action.payload.id && i.listId === action.payload.listId
        ).length
      ) {
        return {
          ...state,
          items: state.items.map((i) => {
            return i.id === action.payload.id &&
              i.listId === action.payload.listId
              ? action.payload
              : i
          }),
        }
      } else {
        return {
          ...state,
          items: [...state.items, action.payload],
        }
      }
    }
    default:
      return state
  }
}
