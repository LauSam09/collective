import { faCheck, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { Button } from "Common"

import classes from "./Ingredient.module.css"

interface IngredientProps {
  name: string
  added: boolean
  toggle: () => void
}

export const Ingredient = (props: IngredientProps) => {
  const { added, name, toggle } = props

  return (
    <div>
      <Button
        title={added ? "Added to list (click to remove)" : "Add to list"}
        onClick={toggle}
        className={classes.toggle}
      >
        <FontAwesomeIcon icon={added ? faCheck : faPlus} />
      </Button>
      <span className={classes.name}>{name}</span>
    </div>
  )
}
