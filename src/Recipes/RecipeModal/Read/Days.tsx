import { useState } from "react"
import cx from "classnames/bind"

import { weekDays } from "Constants"
import { useRecipes } from "Recipes/useRecipes"

import classes from "./Days.module.css"

const classnames = cx.bind(classes)

interface DaysProps {
  id: string
  recipeDays: number[]
}

export const Days = (props: DaysProps) => {
  const { id, recipeDays: initialDays } = props
  const [recipeDays, setRecipeDays] = useState(initialDays)
  const { assignRecipe } = useRecipes()

  const days = weekDays.map((d, i) => ({
    name: d,
    selected: recipeDays.findIndex((rd) => rd === i) >= 0,
  }))

  async function handleClick(day: number) {
    let updatedDays: number[] = []
    if (days[day].selected) {
      updatedDays = recipeDays.filter((d) => d !== day)
    } else {
      updatedDays = [...recipeDays, day]
    }
    setRecipeDays(updatedDays)
    await assignRecipe(id, updatedDays)
  }

  return (
    <div className={classes.container}>
      {days.map((d, i) => (
        <button
          key={d.name}
          onClick={() => handleClick(i)}
          className={classnames("button", { selected: d.selected })}
        >
          {d.name}
        </button>
      ))}
    </div>
  )
}
