import { useUserContext } from "Authentication"
import { DatabaseRecipe, RecipeModel } from "Recipes"

import { db } from "Config"

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

  function getAssignedRecipes(recipes: RecipeModel[]) {
    return recipes.filter((r) => r.days && r.days.length > 0)
  }

  function unassignRecipes(ids: string[]) {
    const batch = db.batch()

    for (const id of ids) {
      const ref = recipesCollection.doc(id)
      batch.update(ref, { days: [] })
    }

    return batch.commit()
  }

  return {
    addRecipe,
    assignRecipe,
    getAssignedRecipes,
    unassignRecipes,
    updateRecipe,
  }
}
