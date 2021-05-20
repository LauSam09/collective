import { useState } from "react"

import { weekDays } from "Constants"
import { RecipeModel, useRecipes } from "Recipes"

import { WeeklyRecipeListItem } from "./ListItem"
import { DayButton } from "./DayButton"

import classes from "./WeeklyRecipes.module.css"
import { DateService } from "Common"

interface WeeklyRecipesProps {
  recipes: RecipeModel[]
  onClickRecipe: (recipe: RecipeModel) => void
}

export const WeeklyRecipes = (props: WeeklyRecipesProps) => {
  const { recipes, onClickRecipe } = props
  const [selectedDay, setSelectedDay] = useState<number | undefined>(DateService.getCurrentDay())
  const { assignRecipe } = useRecipes()

  const recipesByDay: string[][] = weekDays.map(() => [])
  recipes.forEach((r) => r.days?.forEach((d) => recipesByDay[d].push(r.id)))

  const selectedDayRecipes =
    selectedDay === undefined
      ? []
      : // flatMap as type is inferred as (Recipe | undefined)[] even with filter.
        // See https://github.com/microsoft/TypeScript/issues/16069#issuecomment-730710964
        recipesByDay[selectedDay].flatMap((id) => {
          const recipe = recipes.find((r) => r.id === id)
          if (recipe === undefined) {
            return []
          } else {
            return recipe
          }
        })

  async function handleClickRemove(recipe: RecipeModel) {
    assignRecipe(recipe.id, recipe.days?.filter((d) => d !== selectedDay) ?? [])
  }

  return (
    <div className={classes.container}>
      <div className={classes.daysContainer}>
        {recipesByDay.map((d, i) => (
          <DayButton
            key={i}
            count={d.length}
            day={weekDays[i]}
            onClick={() => setSelectedDay((day) => (day === i ? undefined : i))}
            selected={i === selectedDay}
          />
        ))}
      </div>
      {selectedDay === undefined ? null : (
        <ul>
          {selectedDayRecipes.map((recipe) => (
            <li key={recipe.id}>
              <WeeklyRecipeListItem
                recipe={recipe}
                onClickRecipe={() => onClickRecipe(recipe)}
                onClickRemove={() => handleClickRemove(recipe)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
