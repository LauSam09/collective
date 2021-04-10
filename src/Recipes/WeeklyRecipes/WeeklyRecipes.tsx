import { useState } from "react"
import cx from "classnames/bind"

import { Recipe } from "Recipes/models"

import classes from "./WeeklyRecipes.module.css"

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
}

export function WeeklyRecipes(props: WeeklyRecipesProps) {
  const { recipes } = props
  const [selectedDay, setSelectedDay] = useState<number>()
  const recipesByDay: string[][] = days.map(() => [])
  recipes.forEach((r) => r.days.forEach((d) => recipesByDay[d].push(r.id)))

  return (
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
  )
}
