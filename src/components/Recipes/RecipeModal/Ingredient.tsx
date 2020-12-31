import React from "react"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { useItems } from "hooks"
import { Pill } from "components"

import classes from "./Ingredient.module.css"

type IngredientProps = {
  name: string
}

export default function Ingredient(props: IngredientProps) {
  const { name } = props
  const { addItem, getMatchingItem, removeItem } = useItems()

  const addedIngredient = getMatchingItem(name)

  return addedIngredient ? (
    <div className={classes.added}>
      <Pill text={name} remove={() => removeItem(addedIngredient?.id)} />
    </div>
  ) : (
    <div className={classes.unadded}>
      <Pill
        text={name}
        remove={() =>
          addItem({
            name,
            id: "",
            completed: false,
          })
        }
        icon={<FontAwesomeIcon icon={faPlus} />}
      />
    </div>
  )
}
