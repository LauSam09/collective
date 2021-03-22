import { useUserContext } from "Authentication"
import { Category, Item as ItemModel } from "../../models"
import { Item } from "../Common/Item"

import classes from "./ListItem.module.css"

export type ListItemProps = {
  item: ItemModel
  category: Category | undefined
  onClickCategory: () => void
}

export function ListItem(props: ListItemProps) {
  const { item, category, onClickCategory } = props
  const { getDefaultItemsCollection } = useUserContext()

  const handleChange = async () => {
    await getDefaultItemsCollection()
      .doc(item.id)
      .update({ completed: !item.completed })
  }

  return (
    <Item onClickCategory={onClickCategory} buttonColour={category?.colour}>
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
