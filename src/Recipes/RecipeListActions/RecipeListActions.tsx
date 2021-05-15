import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, ConfirmationModal } from "Common"
import { useState } from "react"
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
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)

  const { getAssignedRecipes, unassignRecipes } = useRecipes()

  const assignedRecipes = getAssignedRecipes(recipes)
  const anySelected = assignedRecipes.length > 0

  const handleConfirmClearWeek = async () => {
    await unassignRecipes(assignedRecipes.map((r) => r.id))
    setConfirmModalOpen(false)
  }

  return (
    <div className={classes.container}>
      <ConfirmationModal
        isOpen={confirmModalOpen}
        text="Are you sure you want to clear the recipes for this week?"
        onClickCancel={() => setConfirmModalOpen(false)}
        onClickConfirm={handleConfirmClearWeek}
      />
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
        onClick={() => setConfirmModalOpen(true)}
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
