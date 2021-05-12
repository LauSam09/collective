import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { Button } from "Common"
import { ItemModel } from "Lists"

import { ListItem } from "../../ListItem"

import classes from "./Category.module.css"

export interface CategoryItems {
  items: ItemModel[]
  id?: string | undefined
  name: string
  colour: string
  order: number
}

export interface CategoryProps {
  category: CategoryItems
  onClickAddCategoryItem: (id: string | undefined) => void
  onClickItem: (item: ItemModel) => void
  onClickItemCategory: (item: ItemModel) => void
}

export const Category = (props: CategoryProps) => {
  const { category, onClickAddCategoryItem, onClickItem, onClickItemCategory } =
    props
  const { id, colour, items, name } = category

  return (
    <div
      className={classes.category}
      style={{ backgroundColor: `${colour}40` }}
    >
      <div className={classes.categoryHeader}>
        <small>{name.toLocaleUpperCase()} </small>
        <Button onClick={() => onClickAddCategoryItem(id)}>
          <FontAwesomeIcon icon={faPlus} />
        </Button>
      </div>
      <div className={classes.items}>
        {items.map((item) => (
          <ListItem
            key={item.name}
            item={item}
            category={category}
            onClickCategory={() => onClickItemCategory(item)}
            onClickItem={() => onClickItem(item)}
          />
        ))}
      </div>
    </div>
  )
}
