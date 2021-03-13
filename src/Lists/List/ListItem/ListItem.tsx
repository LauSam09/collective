import { useGroup } from "Authentication"
import { db } from "Config"
import { Category, Item as ItemModel } from "../../models"
import { Item } from "../Common/Item"

import classes from "./ListItem.module.css"

export type ListItemProps = {
  item: ItemModel
  category: Category | undefined
}

export function ListItem(props: ListItemProps) {
  const { item, category } = props
  const { defaultList, id } = useGroup() || {}

  if (!defaultList || !id) {
    throw new Error("Group not defined for user.")
  }

  const handleChange = async () => {
    await db
      .collection("groups")
      .doc(id)
      .collection("lists")
      .doc(defaultList)
      .collection("items")
      .doc(item.id)
      .update({ completed: !item.completed })
  }

  return (
    <Item buttonColour={category?.colour}>
      <div className={classes.content}>
        <input
          type="checkbox"
          checked={item.completed}
          onChange={handleChange}
        />
        <div className={classes.details}>
          <span>{item.name}</span>
          <small>{item.notes}</small>
        </div>
      </div>
    </Item>
  )
}
