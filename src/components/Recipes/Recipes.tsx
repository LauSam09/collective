import React, { useState } from "react"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { Button } from "components"

import useRecipes from "./useRecipes"

import classes from "./Recipes.module.css"
import RecipeModal from "./RecipeModal"

const days = ["sat", "sun", "mon", "tue", "wed", "thu", "fri"]

export default function Recipes() {
  const { recipes, addRecipe, deleteRecipe, setDay } = useRecipes()
  const assignedRecipes = recipes.filter((recipe) => recipe.day !== undefined)
  const assignedDays = assignedRecipes.map((recipe) => recipe.day)
  const [modalOpen, setModalOpen] = useState(false)
  const unassignedDays = [...Array(7).keys()].filter(
    (day) => assignedDays.indexOf(day) < 0
  )

  return (
    <>
      <RecipeModal
        open={modalOpen}
        close={() => setModalOpen(false)}
        recipes={recipes}
        addRecipe={addRecipe}
      />
      <div className={classes.wrapper}>
        <h2>Recipes</h2>

        <div className={classes.actions}>
          <Button title="Add Recipe" onClick={() => setModalOpen(true)}>
            <FontAwesomeIcon icon={faPlus} size="2x" />
          </Button>
        </div>
      </div>
      <h4>This week</h4>
      <ul>
        {days.map((day, index) => {
          const recipes = assignedRecipes.filter(
            (recipe) => recipe.day === index
          )

          return (
            <li key={index}>
              <span>{day} </span>
              {recipes.length === 1 && recipes[0].name}
            </li>
          )
        })}
      </ul>
      <div>
        <ul>
          <li>
            {recipes.map((recipe) => (
              <li key={recipe.id}>
                {recipe.name}
                <select
                  value={recipe.day}
                  onChange={(e) =>
                    setDay(
                      recipe.id,
                      e.target.value === "-" ? undefined : +e.target.value
                    )
                  }
                >
                  {/* TODO separate component so days can be ordered correctly? */}
                  <option value={undefined}> - </option>
                  {recipe.day !== undefined && (
                    <option value={recipe.day}>{days[recipe.day]}</option>
                  )}
                  {unassignedDays.map((day) => (
                    <option key={day} value={day}>
                      {days[day]}
                    </option>
                  ))}
                </select>
                <button onClick={() => deleteRecipe(recipe.id)}>x</button>
              </li>
            ))}
          </li>
        </ul>
      </div>
    </>
  )
}
