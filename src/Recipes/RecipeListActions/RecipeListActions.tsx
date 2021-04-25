import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "Common"
import { FilterRecipes } from "./FilterRecipes/FilterRecipes"

import classes from "./RecipeListActions.module.css"

type RecipeListActionsProps = {
  onClickAdd: () => void
  onFilterChange: (filter: string) => void
}

export function RecipeListActions(props: RecipeListActionsProps) {
  const { onClickAdd, onFilterChange } = props

  return (
    <div className={classes.container}>
      <FilterRecipes onFilterChange={onFilterChange} />
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
