import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import classes from "./RecipeListActions.module.css"

type RecipeListActionsProps = {
  onClickAdd: () => void
}

export function RecipeListActions(props: RecipeListActionsProps) {
  const { onClickAdd } = props

  return (
    <div className={classes.container}>
      <button
        onClick={onClickAdd}
        title="Add recipe"
        type="button"
        className={classes.button}
      >
        <FontAwesomeIcon icon={faPlus} size="lg" />
      </button>
    </div>
  )
}
