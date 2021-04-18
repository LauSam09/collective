import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"

import { Item } from "Lists"

import { Recipe } from "./models"
import { RecipeList } from "./RecipeList"
import { RecipeModal } from "./RecipeModal"
import { WeeklyRecipes } from "./WeeklyRecipes"
import { RecipeListActions } from "./RecipeListActions"

type RecipesProps = {
  addedItems: Item[]
  recipes: Recipe[]
}

export function Recipes(props: RecipesProps) {
  const { addedItems, recipes } = props
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>({
    name: "",
    id: "",
    days: [],
  })

  function handleClickRecipe(recipe: Recipe) {
    setSelectedRecipe(recipe)
    setModalOpen(true)
  }

  function handleCloseRecipeModal() {
    setModalOpen(false)
  }

  function handleClickAdd() {
    setSelectedRecipe({
      name: "",
      id: "",
      days: [],
    })
    setModalOpen(true)
  }

  return (
    <>
      <RecipeModal
        isOpen={modalOpen}
        recipe={selectedRecipe}
        addedItems={addedItems}
        close={handleCloseRecipeModal}
      />
      <WeeklyRecipes recipes={recipes} onClickRecipe={handleClickRecipe} />
      <RecipeListActions onClickAdd={handleClickAdd} />
      <RecipeList recipes={recipes} onClickRecipe={handleClickRecipe} />
    </>
  )
}
