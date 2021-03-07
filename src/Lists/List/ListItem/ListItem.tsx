import { faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { Item } from "../../models"

import classes from "./ListItem.module.css"

export type ListItemProps = {
  item: Item
}

export function ListItem(props: ListItemProps) {
  const { item } = props

  return (
    <div className={classes.container}>
      <input type="checkbox" checked={item.completed} />
      <div className={classes.details}>
        <span>{item.name}</span>
        <small>{item.notes}</small>
      </div>
      <button>
        <FontAwesomeIcon icon={faBars} size="2x" />
      </button>
    </div>
  )
}
