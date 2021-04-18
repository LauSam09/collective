import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "Common"

import classes from "./RecipeListActions.module.css"

type RecipeListActionsProps = {
  onClickAdd: () => void
}

export function RecipeListActions(props: RecipeListActionsProps) {
  const { onClickAdd } = props

  return (
    <div className={classes.container}>
      <Button
        onClick={onClickAdd}
        title="Add recipe"
        type="button"
        className={classes.button}
      >
        <FontAwesomeIcon icon={faPlus} size="lg" />
      </Button>
    </div>
  )
}
