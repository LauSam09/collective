import { useState } from "react"
import cx from "classnames/bind"

import classes from "./WeeklyRecipes.module.css"

const classnames = cx.bind(classes)

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

type DayButtonProps = {
  day: string
  selected: boolean
  onClick: () => void
}

function DayButton(props: DayButtonProps) {
  const { day, selected, onClick } = props

  return (
    <button
      onClick={onClick}
      className={classnames(classes.dayButton, { selected })}
    >
      <span>{day}</span>
    </button>
  )
}

export function WeeklyRecipes() {
  const [selectedDay, setSelectedDay] = useState<number>()

  return (
    <div style={{ display: "flex" }}>
      {days.map((d, i) => (
        <DayButton
          day={d}
          onClick={() => setSelectedDay(i)}
          selected={i === selectedDay}
        />
      ))}
    </div>
  )
}
