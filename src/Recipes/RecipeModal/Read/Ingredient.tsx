import { faCheck, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { Button } from "Common"

import classes from "./Ingredient.module.css"

type IngredientProps = {
  name: string
  added: boolean
  toggle: () => void
}

export function Ingredient(props: IngredientProps) {
  const { added, name, toggle } = props

  return (
    <div>
      <span className={classes.name}>{name}</span>
      <Button
        title={added ? "Added to list (click to remove)" : "Add to list"}
        onClick={toggle}
      >
        <FontAwesomeIcon icon={added ? faCheck : faPlus} />
      </Button>
    </div>
  )
}
