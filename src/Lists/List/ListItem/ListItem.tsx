import { faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { Category, Item } from "../../models"

import classes from "./ListItem.module.css"

export type ListItemProps = {
  item: Item
  category: Category | undefined
}

export function ListItem(props: ListItemProps) {
  const { item, category } = props

  return (
    <div className={classes.container}>
      <input type="checkbox" checked={item.completed} />
      <div className={classes.details}>
        <span>{item.name}</span>
        <small>{item.notes}</small>
      </div>
      <button
        style={{
          backgroundColor: category?.colour || "inherit",
        }}
      >
        <FontAwesomeIcon icon={faBars} size="2x" />
      </button>
    </div>
  )
}
