import { useCallback, useState } from "react"

import { ItemModel } from "Lists"

import { RecipeModel } from "./models"
import { RecipeList } from "./RecipeList"
import { RecipeModal } from "./RecipeModal"
import { WeeklyRecipes } from "./WeeklyRecipes"
import { RecipeListActions } from "./RecipeListActions"

interface RecipesProps {
  addedItems: ItemModel[]
  recipes: RecipeModel[]
}

export const Recipes = (props: RecipesProps) => {
  const { addedItems, recipes } = props
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeModel>({
    name: "",
    id: "",
    days: [],
  })
  const [filteredRecipes, setFilteredRecipes] = useState(recipes)

  function handleClickRecipe(recipe: RecipeModel) {
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

  const handleFilterChanged = useCallback(
    (filter: string) => {
      const lowerFilter = filter.toLowerCase()
      if (lowerFilter === "") {
        setFilteredRecipes(recipes)
      } else {
        setFilteredRecipes(
          recipes.filter((r) => r.name.toLowerCase().includes(lowerFilter))
        )
      }
    },
    [recipes]
  )

  return (
    <>
      <RecipeModal
        isOpen={modalOpen}
        recipe={selectedRecipe}
        addedItems={addedItems}
        close={handleCloseRecipeModal}
      />
      <WeeklyRecipes recipes={recipes} onClickRecipe={handleClickRecipe} />
      <RecipeListActions
        onClickAdd={handleClickAdd}
        onFilterChange={handleFilterChanged}
      />
      <RecipeList recipes={filteredRecipes} onClickRecipe={handleClickRecipe} />
    </>
  )
}
