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
  setCategory: (categoryId: string) => void
  toggleComplete: (complete: boolean) => void
  deleteItem: () => void
  remove: () => void
  icon: ItemIcon
}

export default function Item(props: Props) {
  const {
    item,
    categories,
    toggleComplete,
    setCategory,
    deleteItem,
    remove,
    icon,
  } = props

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
      />

      {/* <select
        value={item.category}
        onChange={(e) =>
          setCategory(e.target.value === "-" ? "" : e.target.value)
        }
      >
        <option value={undefined}> - </option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <button onClick={() => deleteItem()}>x</button>
      <button onClick={() => remove()}>-</button> */}
    </div>
  )
}
