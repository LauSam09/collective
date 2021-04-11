import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { RecipeListItem, RecipeListItemProps } from "../RecipeList"

import classes from "./WeeklyRecipeListItem.module.css"

type WeeklyRecipeListItemProps = RecipeListItemProps & {
  onClickDelete: () => void
}

export function WeeklyRecipeListItem(props: WeeklyRecipeListItemProps) {
  const { onClickDelete, ...listItemProps } = props
  return (
    <div className={classes.container}>
      <div className={classes.listItem}>
        <RecipeListItem {...listItemProps} />
      </div>
      <button onClick={onClickDelete} className={classes.button}>
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  )
}
