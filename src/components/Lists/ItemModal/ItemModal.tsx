import React, { useState } from "react"
import { faWindowClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { Button, Modal } from "components"
import { Category, Item } from "models"
import classes from "./ItemModal.module.css"

type Props = {
  item: Item
  open: boolean
  close: () => void
  categories: Category[]
  setCategory: (categoryId: string) => Promise<void>
  removeItem: () => Promise<void>
  deleteItem: () => Promise<void>
}

export default function ItemModal(props: Props) {
  const {
    item,
    open,
    close,
    categories,
    setCategory: updateCategory,
    removeItem,
    deleteItem,
  } = props
  const [category, setCategory] = useState(item.category)

  const handleSetCategory = async (category: string) => {
    setCategory(category)
    await updateCategory(category)
  }

  const handleRemoveItem = async () => {
    await removeItem()
    close()
  }

  const handleDeleteItem = async () => {
    await deleteItem()
    close()
  }

  return (
    <Modal isOpen={open} onRequestClose={close} closeTimeoutMS={250}>
      <section className={classes.modal}>
        <div className={classes.header}>
          <h3>{item?.name}</h3>
          <Button onClick={close}>
            <FontAwesomeIcon icon={faWindowClose} size="2x" />
          </Button>
        </div>
        <div className={classes.modalBody}>
          <div>
            <label>Category</label>
            <select
              value={category}
              onChange={(e) =>
                handleSetCategory(e.target.value === "-" ? "" : e.target.value)
              }
            >
              <option value={undefined}> - </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className={classes.actions}>
            <label>Actions</label>
            <button onClick={handleRemoveItem}>Remove From List</button>
            <button onClick={handleDeleteItem} style={{ color: "red" }}>
              Delete
            </button>
          </div>
        </div>
      </section>
    </Modal>
  )
}
