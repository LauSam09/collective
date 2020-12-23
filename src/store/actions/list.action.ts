import { Item } from "models"

export interface ListItem extends Item {
  listId: string
}

export const UPSERT_ITEM = "UPSERT_ITEM"

interface UpsertItemAction {
  type: typeof UPSERT_ITEM
  payload: ListItem
}

export const REMOVE_ITEM = "REMOVE_ITEM"

interface RemoveItemAction {
  type: typeof REMOVE_ITEM
  payload: { id: string; listId: string }
}

export type ListActionTypes = UpsertItemAction | RemoveItemAction

export function upsertItem(item: ListItem): UpsertItemAction {
  return {
    type: UPSERT_ITEM,
    payload: item,
  }
}

export function removeItem(item: {
  id: string
  listId: string
}): RemoveItemAction {
  return {
    type: REMOVE_ITEM,
    payload: item,
  }
}
