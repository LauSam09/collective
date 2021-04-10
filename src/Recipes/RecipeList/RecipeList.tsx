import { Recipe } from "Recipes/models"

import classes from "./RecipeList.module.css"

type RecipeListItemProps = {
  name: string
}

function RecipeListItem(props: RecipeListItemProps) {
  const { name } = props
  return (
    <li className={classes.recipe}>
      <span>{name}</span>
    </li>
  )
}

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
