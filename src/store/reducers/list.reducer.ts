import { ListItem, ListActionTypes } from "../actions"

type ListState = {
  items: ListItem[]
}

const initialState: ListState = {
  items: [],
}

export default function (state = initialState, action: ListActionTypes) {
  switch (action.type) {
    default:
      return state
  }
}
