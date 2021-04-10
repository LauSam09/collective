import { Recipe } from "./models"

const staticRecipes: Recipe[] = [
  { id: "1", name: "Macaroni Cheese" },
  { id: "2", name: "Lasagne" },
]

export function useRecipes() {
  return { recipes: staticRecipes }
}
