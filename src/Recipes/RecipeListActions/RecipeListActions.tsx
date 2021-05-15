import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "Common"
import { RecipeModel } from "Recipes"
import { useRecipes } from "Recipes/useRecipes"

import { FilterRecipes } from "./FilterRecipes/FilterRecipes"

import classes from "./RecipeListActions.module.css"

interface RecipeListActionsProps {
  recipes: RecipeModel[]
  onClickAdd: () => void
  onFilterChange: (filter: string) => void
}

export const RecipeListActions = (props: RecipeListActionsProps) => {
  const { recipes, onClickAdd, onFilterChange } = props

  const { getAssignedRecipes, unassignRecipes } = useRecipes()

  const assignedRecipes = getAssignedRecipes(recipes)
  const anySelected = assignedRecipes.length > 0

  const handleClickClearWeek = async () => {
    await unassignRecipes(assignedRecipes.map((r) => r.id))
  }

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
      <Button
        onClick={handleClickClearWeek}
        title="Clear Week"
        type="button"
        disabled={!anySelected}
        className={classes.button}
      >
        <FontAwesomeIcon icon={faTrash} size="lg" />
      </Button>
    </div>
  )
}
