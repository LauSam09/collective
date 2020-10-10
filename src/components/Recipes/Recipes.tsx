import React, { FormEvent, useState } from "react"

import useRecipes from "./useRecipes"

const days = ["sat", "sun", "mon", "tue", "wed", "thu", "fri"]

export default function Recipes() {
  const { recipes, addRecipe, deleteRecipe, setDay } = useRecipes()
  const [name, setName] = useState("")
  const assignedRecipes = recipes.filter((recipe) => recipe.day !== undefined)
  const assignedDays = assignedRecipes.map((recipe) => recipe.day)
  const unassignedDays = [...Array(7).keys()].filter(
    (day) => assignedDays.indexOf(day) < 0
  )

  const valid =
    name &&
    recipes.filter(
      (recipe) => recipe.name.trim().toLowerCase() === name.trim().toLowerCase()
    ).length === 0

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    await addRecipe({ name, id: "" })
    setName("")
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit" disabled={!valid}>
          Add
        </button>
      </form>
      <h2>Recipes</h2>
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
