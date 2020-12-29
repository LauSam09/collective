import React from "react"
import { useSelector } from "react-redux"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { Item } from "models"
import { RootState } from "store"
import { Pill } from "components"

import classes from "./Ingredient.module.css"

type IngredientProps = {
  name: string
  addItem: (item: Item) => Promise<void>
  removeItem: (id: string) => Promise<void>
}

export default function Ingredient(props: IngredientProps) {
  const { name, addItem, removeItem } = props
  const listItems = useSelector((state: RootState) => state.listState.items)
  const lowerName = name.toLowerCase()

  const addedIngredient = listItems.find((i) => i.lowerName === lowerName)

  return addedIngredient ? (
    <div className={classes.added}>
      <Pill text={name} remove={() => removeItem(addedIngredient?.id)} />
    </div>
  ) : (
    <div>
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
