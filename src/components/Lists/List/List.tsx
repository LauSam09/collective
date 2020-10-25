import React, { FormEvent, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleNotch, faTrash } from "@fortawesome/free-solid-svg-icons"

import useList from "./useList"

import Item from "./Item"
import EditModal from "../ItemModal"
import { ItemIcon, Item as ItemModel } from "models"

import classes from "./List.module.css"

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
  const [name, setName] = useState("")
  const [itemBeingEdited, setItemBeingEdited] = useState<ItemModel>()
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
          item={itemBeingEdited}
          close={() => setItemBeingEdited(undefined)}
          categories={categories}
          setCategory={(categoryId: string) =>
            handleSetCategory(itemBeingEdited.id, categoryId)
          }
          removeItem={() => removeItem(itemBeingEdited.id)}
          deleteItem={() => deleteItem(itemBeingEdited.id)}
        />
      )}
      <div className={classes.wrapper}>
        <div className={classes.clear}>
          <button
            onClick={removeAllCompleted}
            title="Clear completed"
            disabled={!categoriesLoaded}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
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
                      open={() => setItemBeingEdited(item)}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p>No items added yet</p>
            )}
            <form onSubmit={handleSubmit} className={classes.addForm}>
              <input
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
      </div>
    </>
  )
}
