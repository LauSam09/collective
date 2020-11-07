import React, { FormEvent, useRef, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCircleNotch,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons"

import useList from "./useList"

import Item from "./Item"
import EditModal from "../ItemModal"
import { ItemIcon, Item as ItemModel } from "models"

import classes from "./List.module.css"
import { Button } from "components"

export default function Lists() {
  const {
    categoriesLoaded,
    items,
    categories,
    addItem,
    deleteItem,
    removeItem,
    removeAllCompleted,
    setCompletionStatus,
    setCategory,
  } = useList()
  const inputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState("")
  const [itemBeingEdited, setItemBeingEdited] = useState<ItemModel>()
  const [modalOpen, setModalOpen] = useState(false)
  const categorisedItems = items
    .filter((item) => !item.category)
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

  const valid =
    name &&
    items.filter(
      (item) => item.name.trim().toLowerCase() === name.trim().toLowerCase()
    ).length === 0

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setName("")

    await addItem({ name, id: "", completed: false })
  }

  const handleSetCategory = async (id: string, categoryId: string) => {
    await setCategory(id, categoryId)
    itemBeingEdited &&
      setItemBeingEdited({ ...itemBeingEdited, category: categoryId })
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
          categories={categories}
          setCategory={(categoryId: string) =>
            handleSetCategory(itemBeingEdited?.id || "", categoryId)
          }
          removeItem={() => removeItem(itemBeingEdited.id)}
          deleteItem={() => deleteItem(itemBeingEdited.id)}
        />
      )}
      <>
        <div className={classes.actions}>
          <Button onClick={() => inputRef.current?.focus()}>
            <FontAwesomeIcon icon={faPlus} size="2x" />
          </Button>
          <Button
            onClick={removeAllCompleted}
            title="Clear completed"
            disabled={!categoriesLoaded}
          >
            <FontAwesomeIcon icon={faTrash} size="2x" />
          </Button>
        </div>
        {categoriesLoaded ? (
          <>
            {categorisedItems.length ? (
              <ul className={classes.list}>
                {categorisedItems.map((item) => (
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
        ) : (
          <div className={classes.spinner}>
            <FontAwesomeIcon icon={faCircleNotch} className="fa-spin" />
          </div>
        )}
      </>
    </>
  )
}
