import { useState } from "react"
import cx from "classnames/bind"

import { weekDays } from "Constants"
import { RecipeModel, useRecipes } from "Recipes"

import { WeeklyRecipeListItem } from "./WeeklyRecipeListItem"

import classes from "./WeeklyRecipes.module.css"

const classnames = cx.bind(classes)

interface DayButtonProps {
  day: string
  count: number
  selected: boolean
  onClick: () => void
}

const DayButton = (props: DayButtonProps) => {
  const { count, day, selected, onClick } = props

  return (
    <button
      onClick={onClick}
      className={classnames(classes.dayButton, { selected })}
    >
      <span>{day}</span>
      {count > 0 ? <span className={classes.count}>{count}</span> : null}
    </button>
  )
}

interface WeeklyRecipesProps {
  recipes: RecipeModel[]
  onClickRecipe: (recipe: RecipeModel) => void
}

export const WeeklyRecipes = (props: WeeklyRecipesProps) => {
  const { recipes, onClickRecipe } = props
  const [selectedDay, setSelectedDay] = useState<number>()
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
    <>
      <div style={{ display: "flex" }}>
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
          {selectedDayRecipes.map((r) => (
            <li key={r.id}>
              <WeeklyRecipeListItem
                name={r.name}
                onClickRecipe={() => onClickRecipe(r)}
                onClickRemove={() => handleClickRemove(r)}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
