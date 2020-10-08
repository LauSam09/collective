import React from "react"

import useRecipes from "./useRecipes"

export default function Recipes() {
  const { recipes } = useRecipes()

  return (
    <>
      <h2>Recipes</h2>
      <div>
        <ul>
          <li>
            {recipes.map((recipe) => (
              <li key={recipe.id}>{recipe.name}</li>
            ))}
          </li>
        </ul>
      </div>
    </>
  )
}
