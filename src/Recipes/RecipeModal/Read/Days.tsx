import { useState } from "react"
import { useRecipes } from "Recipes/useRecipes"

// TODO duplicated in `WeeklyRecipes.tsx`
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

type DaysProps = {
  id: string
  recipeDays: number[]
}

export function Days(props: DaysProps) {
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
    <div style={{ display: "flex" }}>
      {days.map((d, i) => (
        <button
          onClick={() => handleClick(i)}
          style={{
            flex: 1,
            backgroundColor: d.selected ? "green" : "inherit",
          }}
        >
          {d.name}
        </button>
      ))}
    </div>
  )
}
