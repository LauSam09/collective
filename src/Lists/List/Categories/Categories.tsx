import { ItemModel, useCategories } from "Lists"

import { Category } from "./Category"

import classes from "./Categories.module.css"

export interface CategoriesProps {
  addedItems: ItemModel[]
  showCompleted: boolean
  onClickAddCategoryItem: (id: string | undefined) => void
  onClickItem: (item: ItemModel) => void
  onClickItemCategory: (item: ItemModel) => void
}

export const Categories = (props: CategoriesProps) => {
  const {
    addedItems,
    showCompleted,
    onClickAddCategoryItem,
    onClickItem,
    onClickItemCategory,
  } = props

  const categories = useCategories()

  const uncategorisedItems = addedItems.filter(
    (i) => !i.category || categories.findIndex((c) => c.id === i.category) < 0
  )

  const groupedItems = [...categories]
    .sort((a, b) => a.order - b.order)
    .map((c) => ({
      ...c,
      items: addedItems
        .filter((i) => i.category === c.id)
        .sort((a, b) => a.lowerName.localeCompare(b.lowerName)),
    }))

  if (uncategorisedItems.length > 0) {
    groupedItems.splice(0, 0, {
      id: "-1",
      name: "Uncategorised",
      order: -1,
      colour: "var(--colour-uncategorised)",
      items: uncategorisedItems.sort((a, b) =>
        a.lowerName.localeCompare(b.lowerName)
      ),
    })
  }

  if (!showCompleted) {
    groupedItems.forEach((c) => {
      c.items = c.items.filter((i) => !i.completed)
    })
  }

  return (
    <div className={classes.list}>
      {groupedItems.map((c) => (
        <Category
          key={c.id}
          category={c}
          onClickAddCategoryItem={onClickAddCategoryItem}
          onClickItem={onClickItem}
          onClickItemCategory={onClickItemCategory}
        />
      ))}
    </div>
  )
}
