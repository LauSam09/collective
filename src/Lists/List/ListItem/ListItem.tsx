import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useUserContext } from "Authentication"
import { Category, Item as ItemModel } from "../../models"
import { Item } from "../Common/Item"

import classes from "./ListItem.module.css"

export interface ListItemProps {
  item: ItemModel
  category: Category | undefined
  onClickCategory: () => void
  onClickItem: () => void
}

export const ListItem = (props: ListItemProps) => {
  const { item, category, onClickCategory, onClickItem } = props
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
        <div className={classes.details} onClick={onClickItem}>
          <span>
            {item.flagged ? (
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className={classes.flag}
              />
            ) : null}
            {item.name}
          </span>
          <small>{item.notes}</small>
        </div>
      </div>
    </Item>
  )
}
