import { Category } from "models"

export interface ListCategory extends Category {
  listId: string
}

export const GET_CATEGORIES = "GET_CATEGORIES"

interface GetCategoriesAction {
  type: typeof GET_CATEGORIES
  payload: ListCategory[]
}

export type CategoryActionTypes = GetCategoriesAction

export function getCategories(categories: ListCategory[]): GetCategoriesAction {
  return {
    type: GET_CATEGORIES,
    payload: categories,
  }
}
