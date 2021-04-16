import { useUserContext } from "Authentication"
import { DatabaseRecipe, Recipe } from "Recipes/models"

export function useRecipes() {
  const { getRecipesCollection } = useUserContext()
  const recipesCollection = getRecipesCollection()

  function recipeToDbRecipe(recipe: Recipe) {
    const dbRecipe: DatabaseRecipe = {
      name: recipe.name,
      days: recipe.days,
      recipeUrl: recipe.recipeUrl,
      ingredients: recipe.ingredients,
    }
    return dbRecipe
  }

  async function addRecipe(recipe: Recipe) {
    const dbRecipe = recipeToDbRecipe(recipe)
    await recipesCollection.add(dbRecipe)
  }

  async function updateRecipe(recipe: Recipe) {
    const dbRecipe = recipeToDbRecipe(recipe)
    await recipesCollection.doc(recipe.id).update(dbRecipe)
  }

  return { addRecipe, updateRecipe }
}
