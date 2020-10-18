import React from "react"

import { Category, Item as ItemModel, ItemIcon } from "models"

import classes from "./Item.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faLayerGroup,
  faShoppingBasket,
  faShoppingCart,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons"

type Props = {
  item: ItemModel
  categories: Category[]
  toggleComplete: (complete: boolean) => void
  icon: ItemIcon
  open: () => void
}

export default function Item(props: Props) {
  const { item, categories, toggleComplete, icon, open } = props

  const category =
    item.category === undefined
      ? undefined
      : categories.filter((category) => category.id === item.category)[0]

  let faIcon: IconDefinition

  switch (icon) {
    case ItemIcon.Basket:
      faIcon = faShoppingBasket
      break
    case ItemIcon.Trolley:
      faIcon = faShoppingCart
      break
    default:
      console.warn(`Unexpected icon ${icon}`)
      faIcon = faLayerGroup
  }

  return (
    <div className={classes.container}>
      <div
        className={classes.clickable}
        onClick={() => toggleComplete(!item.completed)}
      >
        <input type="checkbox" checked={item.completed} />
        {item.name}
      </div>
      <FontAwesomeIcon
        icon={faIcon}
        className={classes.icon}
        style={{ color: category?.colour || "inherit" }}
        onClick={open}
      />
    </div>
  )
}
