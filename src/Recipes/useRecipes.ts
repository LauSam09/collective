import { Recipe } from "./models"

const staticRecipes: Recipe[] = [
  { id: "1", name: "Macaroni Cheese", days: [1] },
  { id: "2", name: "Lasagne", days: [3] },
]

export function useRecipes() {
  return { recipes: staticRecipes }
}
