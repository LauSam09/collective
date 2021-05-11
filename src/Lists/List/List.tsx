import { useState } from "react"
import { useCategories } from "../CategoriesContext"
import { Item } from "../models"

import { ListItem } from "./ListItem"
import { AddItem } from "./AddItem"

import classes from "./List.module.css"
import { CategoryModal } from "./CategoryModal"
import { useUserContext } from "Authentication"
import { ItemModal } from "./ItemModal"
import { ListActions } from "./ListActions"
import { useItems } from "Lists/useItems"

export type ListProps = {
  addedItems: Item[]
  unaddedItems: Item[]
}

export function List(props: ListProps) {
  const { addedItems, unaddedItems } = props
  const categories = useCategories()
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isItemModalOpen, setIsItemModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item>()
  const [showCompleted, setShowCompleted] = useState(true)
  const { batchRemoveItems } = useItems()
  const { getDefaultItemsCollection } = useUserContext()
  const completedItems = addedItems.filter((i) => i.completed)

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

  const handleCategoryClick = (item: Item) => {
    setSelectedItem(item)
    setIsCategoryModalOpen(true)
  }

  const handleItemClick = (item: Item) => {
    setSelectedItem(item)
    setIsItemModalOpen(true)
  }

  const handleSelectCategory = (category: string) =>
    getDefaultItemsCollection().doc(selectedItem?.id).update({ category })

  const handleClearCompleted = async () => {
    const addedIds = completedItems.map((i) => i.id)
    await batchRemoveItems(addedIds)
  }

  return (
    <article>
      <section>
        <AddItem addedItems={addedItems} unaddedItems={unaddedItems} />
        {addedItems.length > 0 ? (
          <ListActions
            disableClearCompleted={completedItems.length === 0}
            showCompleted={showCompleted}
            setShowCompleted={setShowCompleted}
            clearCompleted={handleClearCompleted}
          />
        ) : null}
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
                    onClickItem={() => handleItemClick(item)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <CategoryModal
          isOpen={isCategoryModalOpen}
          selectedCategoryId={selectedItem?.category}
          close={() => setIsCategoryModalOpen(false)}
          select={handleSelectCategory}
        />
        <ItemModal
          isOpen={isItemModalOpen}
          item={selectedItem}
          close={() => setIsItemModalOpen(false)}
        />
      </section>
    </article>
  )
}
