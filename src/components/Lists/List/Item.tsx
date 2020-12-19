import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faLayerGroup,
  faShoppingBasket,
  faShoppingCart,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons"

import { Category, Item as ItemModel, ItemIcon } from "models"

import classes from "./Item.module.css"

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
        className={classes.toggle}
        onClick={() => toggleComplete(!item.completed)}
      >
        <input
          type="checkbox"
          checked={item.completed}
          onChange={() => toggleComplete(!item.completed)}
        />
      </div>
      <div className={classes.title} onClick={open}>
        <span
          style={{
            textDecoration: item.completed ? "line-through" : "inherit",
          }}
        >
          {item.name}
        </span>
        {item.notes && <span className={classes.notes}>{item.notes}</span>}
      </div>
      <FontAwesomeIcon
        icon={faIcon}
        className={classes.icon}
        style={{ color: category?.colour || "inherit" }}
        onClick={open}
        size="lg"
      />
    </div>
  )
}
