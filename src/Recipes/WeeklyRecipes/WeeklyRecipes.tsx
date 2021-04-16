import { useState } from "react"
import cx from "classnames/bind"

import { Recipe } from "Recipes/models"
import { WeeklyRecipeListItem } from "./WeeklyRecipeListItem"

import classes from "./WeeklyRecipes.module.css"
import { useRecipes } from "Recipes/useRecipes"

const classnames = cx.bind(classes)

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

type DayButtonProps = {
  day: string
  count: number
  selected: boolean
  onClick: () => void
}

function DayButton(props: DayButtonProps) {
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

type WeeklyRecipesProps = {
  recipes: Recipe[]
  onClickRecipe: (recipe: Recipe) => void
}

export function WeeklyRecipes(props: WeeklyRecipesProps) {
  const { recipes, onClickRecipe } = props
  const [selectedDay, setSelectedDay] = useState<number>()
  const { assignRecipe } = useRecipes()

  const recipesByDay: string[][] = days.map(() => [])
  recipes.forEach((r) => r.days.forEach((d) => recipesByDay[d].push(r.id)))

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

  async function handleClickRemove(recipe: Recipe) {
    assignRecipe(
      recipe.id,
      recipe.days.filter((d) => d !== selectedDay)
    )
  }

  return (
    <>
      <div style={{ display: "flex" }}>
        {recipesByDay.map((d, i) => (
          <DayButton
            key={i}
            count={d.length}
            day={days[i]}
            onClick={() => setSelectedDay(i)}
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
