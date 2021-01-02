import React, { useState } from "react"
import { useSelector } from "react-redux"
import { faCircleNotch, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import RecipeModal from "./RecipeModal"
import { Button, Pill } from "components"
import { useRecipes } from "hooks"
import { Recipe } from "models"
import { RootState } from "store"

import classes from "./Recipes.module.css"

const days = ["sat", "sun", "mon", "tue", "wed", "thu", "fri"]

export default function Recipes() {
  const {
    addRecipe,
    setDay,
    updateRecipe,
    deleteRecipe,
    loading,
  } = useRecipes()
  const recipes = useSelector((state: RootState) => state.recipeState.recipes)
  const assignedRecipes = recipes.filter((recipe) => recipe.days !== undefined)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>()

  function handleAddClick() {
    setSelectedRecipe(undefined)
    setModalOpen(true)
  }

  function handleRecipeClick(recipe: Recipe) {
    setSelectedRecipe(recipe)
    setModalOpen(true)
  }

  if (loading) {
    return (
      <div className={classes.spinner}>
        <FontAwesomeIcon icon={faCircleNotch} className="fa-spin" />
      </div>
    )
  }

  return (
    <>
      <RecipeModal
        open={modalOpen}
        close={() => setModalOpen(false)}
        recipes={recipes}
        addRecipe={addRecipe}
        recipe={selectedRecipe}
        updateRecipe={updateRecipe}
        deleteRecipe={() => deleteRecipe(selectedRecipe?.id || "")}
      />
      <div className={classes.wrapper}>
        <div className={classes.header}>
          <h2>Recipes</h2>

          <div className={classes.actions}>
            <Button title="Add Recipe" onClick={() => handleAddClick()}>
              <FontAwesomeIcon icon={faPlus} size="2x" />
            </Button>
          </div>
        </div>
        <div className={classes.weekly}>
          <h4>This week</h4>
          <ul>
            {days.map((day, index) => {
              const recipes = assignedRecipes.filter((recipe) =>
                recipe.days?.includes(index)
              )

              return (
                <li key={index}>
                  <span>{day} </span>
                  {recipes.length > 0 &&
                    recipes.map((recipe) => (
                      <Pill
                        key={recipe.id}
                        text={recipe.name}
                        remove={() => setDay(recipe.id, undefined)}
                      />
                    ))}
                </li>
              )
            })}
          </ul>
        </div>
        <div className={classes.recipes}>
          <ul>
            {recipes
              .sort((a, b) =>
                a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
              )
              .map((recipe) => (
                <li
                  key={recipe.id}
                  onClick={() => handleRecipeClick(recipe)}
                  className={classes.recipe}
                >
                  <span>{recipe.name}</span>
                  <select
                    value={
                      recipe.days?.[0] === undefined ? -1 : recipe.days?.[0]
                    }
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      setDay(
                        recipe.id,
                        e.target.value === "-" ? -1 : +e.target.value
                      )
                    }
                  >
                    {/* TODO separate component so days can be ordered correctly? */}
                    <option value={-1}> - </option>
                    {[...Array(7).keys()].map((day) => (
                      <option key={day} value={day}>
                        {days[day]}
                      </option>
                    ))}
                  </select>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  )
}
