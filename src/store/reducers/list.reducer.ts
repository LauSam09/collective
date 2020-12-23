import { ListItem, ListActionTypes, UPSERT_ITEM, REMOVE_ITEM } from "../actions"

type ListState = {
  items: ListItem[]
}

const initialState: ListState = {
  items: [],
}

export default function (
  state = initialState,
  action: ListActionTypes
): ListState {
  const { type, payload } = action
  switch (type) {
    case UPSERT_ITEM: {
      if (
        state.items.filter(
          (i) => i.id === payload.id && i.listId === payload.listId
        ).length
      ) {
        return {
          ...state,
          items: state.items.map((i) => {
            return i.id === payload.id && i.listId === payload.listId
              ? (payload as ListItem)
              : i
          }),
        }
      } else {
        return {
          ...state,
          items: [...state.items, payload as ListItem],
        }
      }
    }
    case REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(
          (i) => !(i.id === payload.id && i.listId === payload.listId)
        ),
      }
    default:
      return state
  }
}
