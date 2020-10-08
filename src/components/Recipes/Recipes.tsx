import React, { FormEvent, useState } from "react"

import useRecipes from "./useRecipes"

const days = ["sat", "sun", "mon", "tue", "wed", "thu", "fri"]

export default function Recipes() {
  const { recipes, addRecipe, deleteRecipe } = useRecipes()
  const [name, setName] = useState("")
  const assignedRecipes = recipes.filter((recipe) => recipe.day !== undefined)

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
                <button onClick={() => deleteRecipe(recipe.id)}>x</button>
              </li>
            ))}
          </li>
        </ul>
      </div>
    </>
  )
}
