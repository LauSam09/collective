import { useState } from "react"
import { useCategories } from "../CategoriesContext"
import { Item } from "../models"

import { ListItem } from "./ListItem"
import { AddItem } from "./AddItem"

import classes from "./List.module.css"
import { CategoryModal } from "./CategoryModal"
import { useUserContext } from "Authentication"

export type ListProps = {
  addedItems: Item[]
  unaddedItems: Item[]
}

export function List(props: ListProps) {
  const { addedItems, unaddedItems } = props
  const categories = useCategories()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item>()
  const { getDefaultItemsCollection } = useUserContext()

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
      colour: "#dedede",
      items: uncategorisedItems.sort((a, b) =>
        a.lowerName.localeCompare(b.lowerName)
      ),
    })
  }

  const handleCategoryClick = (item: Item) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleSelectCategory = (category: string) =>
    getDefaultItemsCollection().doc(selectedItem?.id).update({ category })

  return (
    <article>
      <section>
        <h2>Shopping</h2>
        <AddItem addedItems={addedItems} unaddedItems={unaddedItems} />
        {addedItems.length === 0 ? (
          <span>Nothing added yet!</span>
        ) : (
          <div className={classes.list}>
            {groupedItems.map((c) => (
              <div
                key={c.id}
                className={classes.category}
                style={{ backgroundColor: `${c.colour}40` }}
              >
                <small>{c.name.toLocaleUpperCase()}</small>
                <div className={classes.items}>
                  {c.items.map((item) => (
                    <ListItem
                      key={item.name}
                      item={item}
                      category={c}
                      onClickCategory={() => handleCategoryClick(item)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <CategoryModal
          isOpen={isModalOpen}
          selectedCategoryId={selectedItem?.category}
          close={() => setIsModalOpen(false)}
          select={handleSelectCategory}
        />
      </section>
    </article>
  )
}
