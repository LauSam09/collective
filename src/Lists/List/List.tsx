import { useRef, useState } from "react"

import { useUserContext } from "Authentication"
import { useItems } from "Lists"

import { ItemModel } from "../models"

import { AddItem } from "./AddItem"
import { CategoryModal } from "./CategoryModal"
import { ItemModal } from "./ItemModal"
import { ListActions } from "./ListActions"
import { Categories } from "./Categories"

export interface ListProps {
  addedItems: ItemModel[]
  unaddedItems: ItemModel[]
}

export const List = (props: ListProps) => {
  const { addedItems, unaddedItems } = props
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isItemModalOpen, setIsItemModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ItemModel>()
  const [showCompleted, setShowCompleted] = useState(true)
  const { batchRemoveItems } = useItems()
  const { getDefaultItemsCollection } = useUserContext()
  const [selectedCategory, setSelectedCategory] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const completedItems = addedItems.filter((i) => i.completed)

  const handleClickItemCategory = (item: ItemModel) => {
    setSelectedItem(item)
    setIsCategoryModalOpen(true)
  }

  const handleClickItem = (item: ItemModel) => {
    setSelectedItem(item)
    setIsItemModalOpen(true)
  }

  const handleSelectCategory = (category: string) =>
    getDefaultItemsCollection().doc(selectedItem?.id).update({ category })

  const handleClearCompleted = async () => {
    const addedIds = completedItems.map((i) => i.id)
    await batchRemoveItems(addedIds)
  }

  const handleClickAddCategoryItem = (category: string | undefined) => {
    setSelectedCategory(category ?? "")
    inputRef.current?.focus()
  }

  return (
    <article>
      <section>
        <AddItem
          addedItems={addedItems}
          category={selectedCategory}
          unaddedItems={unaddedItems}
          ref={inputRef}
          setCategory={setSelectedCategory}
        />
        {addedItems.length > 0 ? (
          <ListActions
            disableClearCompleted={completedItems.length === 0}
            showCompleted={showCompleted}
            setShowCompleted={setShowCompleted}
            clearCompleted={handleClearCompleted}
          />
        ) : null}
        <Categories
          addedItems={addedItems}
          showCompleted={showCompleted}
          onClickAddCategoryItem={handleClickAddCategoryItem}
          onClickItem={handleClickItem}
          onClickItemCategory={handleClickItemCategory}
        />
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
