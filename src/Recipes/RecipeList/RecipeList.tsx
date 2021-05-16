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
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <RecipeListItem
              recipe={recipe}
              onClick={() => onClickRecipe(recipe)}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
