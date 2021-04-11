import { useState } from "react"

import { Recipe } from "./models"
import { RecipeList } from "./RecipeList"
import { RecipeModal } from "./RecipeModal"
import { useRecipes } from "./useRecipes"
import { WeeklyRecipes } from "./WeeklyRecipes"

export function Recipes() {
  const { recipes } = useRecipes()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>()

  function handleClickRecipe(recipe: Recipe) {
    setSelectedRecipe(recipe)
    setModalOpen(true)
  }

  function handleCloseRecipeModal() {
    setSelectedRecipe(undefined)
    setModalOpen(false)
  }

  return (
    <>
      <RecipeModal isOpen={modalOpen} close={handleCloseRecipeModal} />
      <WeeklyRecipes recipes={recipes} onClickRecipe={handleClickRecipe} />
      <RecipeList recipes={recipes} onClickRecipe={handleClickRecipe} />
    </>
  )
}
