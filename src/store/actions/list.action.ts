import { Item } from "models"

export interface ListItem extends Item {
  listId: string
}

export const UPSERT_ITEM = "UPSERT_ITEM"

interface UpsertItemAction {
  type: typeof UPSERT_ITEM
  payload: ListItem
}

export type ListActionTypes = UpsertItemAction

export function upsertItem(item: ListItem): UpsertItemAction {
  return {
    type: UPSERT_ITEM,
    payload: item,
  }
}
