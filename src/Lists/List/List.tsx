import { useRef, useState } from "react"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { useUserContext } from "Authentication"
import { Button } from "Common"
import { useItems } from "Lists/useItems"

import { useCategories } from "../CategoriesContext"
import { Item } from "../models"

import { ListItem } from "./ListItem"
import { AddItem } from "./AddItem"
import { CategoryModal } from "./CategoryModal"
import { ItemModal } from "./ItemModal"
import { ListActions } from "./ListActions"

import classes from "./List.module.css"

export interface ListProps {
  addedItems: Item[]
  unaddedItems: Item[]
}

export const List = (props: ListProps) => {
  const { addedItems, unaddedItems } = props
  const categories = useCategories()
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isItemModalOpen, setIsItemModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item>()
  const [showCompleted, setShowCompleted] = useState(true)
  const { batchRemoveItems } = useItems()
  const { getDefaultItemsCollection } = useUserContext()
  const [selectedCategory, setSelectedCategory] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

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

  const handleClickCategoryButton = (category: string | undefined) => {
    setSelectedCategory(category ?? "")
    inputRef.current?.focus()
  }

  return (
    <article>
      <section>
        <AddItem
          addedItems={addedItems}
          category={selectedCategory}
          setCategory={setSelectedCategory}
          unaddedItems={unaddedItems}
          ref={inputRef}
        />
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
              <div className={classes.categoryHeader}>
                <small>{c.name.toLocaleUpperCase()} </small>
                <Button onClick={() => handleClickCategoryButton(c.id)}>
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </div>
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
