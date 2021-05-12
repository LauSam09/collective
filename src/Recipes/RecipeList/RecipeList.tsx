import { RecipeModel } from "Recipes"

import { RecipeListItem } from "./RecipeListItem"

interface RecipeListProps {
  recipes: RecipeModel[]
  onClickRecipe: (recipe: RecipeModel) => void
}

export const RecipeList = (props: RecipeListProps) => {
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
