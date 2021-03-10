import { faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { Category, Item as ItemModel } from "../../models"
import { Item } from "../Common/Item"

import classes from "./ListItem.module.css"

export type ListItemProps = {
  item: ItemModel
  category: Category | undefined
}

export function ListItem(props: ListItemProps) {
  const { item, category } = props

  return (
    <Item buttonColour={category?.colour}>
      <div className={classes.content}>
        <input type="checkbox" checked={item.completed} />
        <div className={classes.details}>
          <span>{item.name}</span>
          <small>{item.notes}</small>
        </div>
      </div>
    </Item>
  )
}
