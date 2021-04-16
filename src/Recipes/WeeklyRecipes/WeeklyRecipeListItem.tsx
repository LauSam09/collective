import { faMinus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { RecipeListItem, RecipeListItemProps } from "../RecipeList"

import classes from "./WeeklyRecipeListItem.module.css"

type WeeklyRecipeListItemProps = RecipeListItemProps & {
  onClickRemove: () => void
  onClickRecipe: () => void
}

export function WeeklyRecipeListItem(props: WeeklyRecipeListItemProps) {
  const { onClickRemove, onClickRecipe, ...listItemProps } = props

  return (
    <div className={classes.container}>
      <div className={classes.listItem}>
        <RecipeListItem onClick={onClickRecipe} {...listItemProps} />
      </div>
      <button onClick={onClickRemove} className={classes.button}>
        <FontAwesomeIcon icon={faMinus} />
      </button>
    </div>
  )
}
