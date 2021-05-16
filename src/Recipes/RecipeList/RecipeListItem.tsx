import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { RecipeModel } from "Recipes"

import classes from "./RecipeListItem.module.css"

export type RecipeListItemProps = {
  recipe: RecipeModel
  onClick?: () => void
}

export function RecipeListItem(props: RecipeListItemProps) {
  const { recipe, onClick } = props
  const { name, recipeUrl, ingredients } = recipe

  return (
    <div onClick={onClick} className={classes.recipe}>
      <span>{name}</span>
      {recipeUrl ? (
        <a
          href={recipeUrl}
          onClick={(e) => e.stopPropagation()}
          target="_blank"
          rel="noreferrer"
          style={{ paddingLeft: "10px" }}
        >
          <FontAwesomeIcon icon={faExternalLinkAlt} size="sm" />
        </a>
      ) : null}
      {(ingredients ?? [])?.length > 0 ? (
        <div className={classes.ingredients}>
          <small>{ingredients?.join(", ")}</small>
        </div>
      ) : null}
    </div>
  )
}
