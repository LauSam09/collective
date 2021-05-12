import { useUserContext } from "Authentication"
import { DatabaseRecipe, RecipeModel } from "Recipes"

export function useRecipes() {
  const { getRecipesCollection } = useUserContext()
  const recipesCollection = getRecipesCollection()

  function recipeToDbRecipe(recipe: RecipeModel) {
    const dbRecipe: DatabaseRecipe = {
      name: recipe.name,
      days: recipe.days,
      recipeUrl: recipe.recipeUrl,
      ingredients: recipe.ingredients,
    }
    return dbRecipe
  }

  async function addRecipe(recipe: RecipeModel) {
    const dbRecipe = recipeToDbRecipe(recipe)
    await recipesCollection.add(dbRecipe)
  }

  async function updateRecipe(recipe: RecipeModel) {
    const dbRecipe = recipeToDbRecipe(recipe)
    await recipesCollection.doc(recipe.id).update(dbRecipe)
  }

  async function assignRecipe(id: string, days: number[]) {
    await recipesCollection.doc(id).update({
      days,
    })
  }

  return { addRecipe, assignRecipe, updateRecipe }
}
