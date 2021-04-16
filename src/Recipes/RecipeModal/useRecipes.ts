import { useUserContext } from "Authentication"
import { DatabaseRecipe, Recipe } from "Recipes/models"

export function useRecipes() {
  const { getRecipesCollection } = useUserContext()
  const recipesCollection = getRecipesCollection()

  async function updateRecipe(recipe: Recipe) {
    const dbRecipe: DatabaseRecipe = {
      name: recipe.name,
      days: recipe.days,
      recipeUrl: recipe.recipeUrl,
      ingredients: recipe.ingredients,
    }

    await recipesCollection.doc(recipe.id).update(dbRecipe)
  }

  return { updateRecipe }
}
