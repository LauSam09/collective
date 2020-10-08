import React, { FormEvent, useState } from "react"

import useRecipes from "./useRecipes"

export default function Recipes() {
  const { recipes, addRecipe, deleteRecipe } = useRecipes()
  const [name, setName] = useState("")

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
