import React, { FormEvent, useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCircleNotch,
  faEye,
  faEyeSlash,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons"

import Item from "./Item"
import CategoryModal from "../CategoryModal"
import EditModal from "../ItemModal"
import { Button } from "components"
import { ItemIcon, Item as ItemModel } from "models"
import { useItems, useCategories } from "hooks"
import { RootState } from "store"

import classes from "./List.module.css"

export default function Lists() {
  const { categoriesLoaded } = useCategories()
  const {
    getMatchingItem,
    addItem,
    deleteItem,
    removeItem,
    removeAllCompleted,
    setCompletionStatus,
    setCategory,
    editItem,
  } = useItems()
  const items = useSelector((state: RootState) => state.listState.items)
  const completedItems = items.filter((i) => i.completed)
  const categories = useSelector(
    (state: RootState) => state.categoryState.categories
  )
  const inputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState("")
  const [itemBeingEdited, setItemBeingEdited] = useState<ItemModel>()
  const [modalOpen, setModalOpen] = useState(false)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [hideCompleted, setHideCompleted] = useState(
    localStorage.getItem("hideCompleted") === "true"
  )

  useEffect(() => {
    localStorage.setItem("hideCompleted", String(hideCompleted))
  }, [hideCompleted])

  // TODO If an item has a category that no longer exists, this list will filter it out incorrectly
  const categorisedItems = items
    .filter((item) => !item.category || item.category === "-")
    .sort((a, b) => a.name.localeCompare(b.name))
    .concat(
      categories
        .sort((a, b) => a.order - b.order)
        .flatMap((category) =>
          items
            .filter((item) => item.category === category.id)
            .sort((a, b) => a.name.localeCompare(b.name))
        )
    )

  const hiddenItems = categorisedItems.filter(
    (i) => i.completed && hideCompleted
  )

  const valid = !getMatchingItem(name)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setName("")

    await addItem({ name, id: "", completed: false })
  }

  const handleSetCategory = async (id: string, categoryId: string) => {
    await setCategory(id, categoryId)
    itemBeingEdited &&
      setItemBeingEdited({ ...itemBeingEdited, category: categoryId })
    if (categoryModalOpen) {
      closeCategoryModal()
    }
  }

  const closeCategoryModal = () => {
    setCategoryModalOpen(false)
    setTimeout(() => setItemBeingEdited(undefined), 250)
  }

  const iconToRender = items.length >= 10 ? ItemIcon.Trolley : ItemIcon.Basket

  return (
    <>
      {itemBeingEdited && (
        <EditModal
          open={modalOpen}
          item={itemBeingEdited}
          close={() => {
            setModalOpen(false)
            setTimeout(() => setItemBeingEdited(undefined), 250)
          }}
          removeItem={() => removeItem(itemBeingEdited.id)}
          deleteItem={() => deleteItem(itemBeingEdited.id)}
          updateItem={async (item) => {
            await editItem(item)
            setModalOpen(false)
            setTimeout(() => setItemBeingEdited(undefined), 250)
          }}
        />
      )}
      {itemBeingEdited && (
        <CategoryModal
          isOpen={categoryModalOpen}
          name={itemBeingEdited.name}
          categories={categories}
          selectedCategoryId={itemBeingEdited.category}
          close={closeCategoryModal}
          selectCategory={(category) =>
            handleSetCategory(itemBeingEdited?.id || "", category.id)
          }
        />
      )}
      {categoriesLoaded ? (
        <>
          <div className={classes.actions}>
            <div className={classes.count}>
              <span>
                {completedItems.length
                  ? `${completedItems.length}/${items.length}`
                  : items.length}
              </span>
            </div>
            <Button title="Add item" onClick={() => inputRef.current?.focus()}>
              <FontAwesomeIcon icon={faPlus} size="1x" />
            </Button>
            {hideCompleted ? (
              <Button
                title="Show completed"
                onClick={() => setHideCompleted((v) => !v)}
              >
                <FontAwesomeIcon icon={faEye} size="1x" />
              </Button>
            ) : (
              <Button
                title="Hide completed"
                onClick={() => setHideCompleted((v) => !v)}
              >
                <FontAwesomeIcon icon={faEyeSlash} size="1x" />
              </Button>
            )}
            <Button
              onClick={removeAllCompleted}
              title="Clear completed"
              disabled={
                !categoriesLoaded ||
                items.filter((i) => i.completed).length === 0
              }
            >
              <FontAwesomeIcon icon={faTrash} size="1x" />
            </Button>
          </div>
          <>
            {hiddenItems.length > 0 && (
              <small>({hiddenItems.length} hidden)</small>
            )}
            {categorisedItems.length ? (
              <ul className={classes.list}>
                {categorisedItems
                  .filter((item) => !hideCompleted || !item.completed)
                  .map((item) => (
                    <li key={item.id}>
                      <Item
                        item={item}
                        categories={categories}
                        toggleComplete={(status) =>
                          setCompletionStatus(item.id, status)
                        }
                        icon={iconToRender}
                        open={() => {
                          setItemBeingEdited(item)
                          setModalOpen(true)
                        }}
                        selectCategory={() => {
                          setItemBeingEdited(item)
                          setCategoryModalOpen(true)
                        }}
                      />
                    </li>
                  ))}
              </ul>
            ) : (
              <p>No items added yet</p>
            )}
            <form onSubmit={handleSubmit} className={classes.addForm}>
              <input
                ref={inputRef}
                value={name}
                className={classes.input}
                onChange={(e) => setName(e.target.value)}
              />
              <button
                type="submit"
                className={classes.submit}
                disabled={!valid}
              >
                Add
              </button>
            </form>
          </>
        </>
      ) : (
        <div className={classes.spinner}>
          <FontAwesomeIcon icon={faCircleNotch} className="fa-spin" />
        </div>
      )}
    </>
  )
}
