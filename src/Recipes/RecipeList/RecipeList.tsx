import { Recipe } from "Recipes/models"

import { RecipeListItem } from "./RecipeListItem"

type RecipeListProps = {
  recipes: Recipe[]
}

export function RecipeList(props: RecipeListProps) {
  const { recipes } = props

  return (
    <div>
      <ul>
        {recipes.map((r) => (
          <RecipeListItem name={r.name} key={r.id} />
        ))}
      </ul>
    </div>
  )
}
