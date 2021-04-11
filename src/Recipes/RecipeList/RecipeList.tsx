import { Recipe } from "Recipes/models"

import { RecipeListItem } from "./RecipeListItem"

type RecipeListProps = {
  recipes: Recipe[]
  onClickRecipe: (recipe: Recipe) => void
}

export function RecipeList(props: RecipeListProps) {
  const { recipes, onClickRecipe } = props

  return (
    <div>
      <ul>
        {recipes.map((r) => (
          <li key={r.id}>
            <RecipeListItem
              name={r.name}
              onClick={() => onClickRecipe(r)}
              key={r.id}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
