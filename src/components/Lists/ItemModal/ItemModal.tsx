import React, { useState } from "react"
import Modal from "react-modal"
import { faWindowClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { Category, Item } from "models"
import classes from "./ItemModal.module.css"

type Props = {
  item: Item
  close: () => void
  categories: Category[]
  setCategory: (categoryId: string) => Promise<void>
  removeItem: () => Promise<void>
  deleteItem: () => Promise<void>
}

export default function EditModal(props: Props) {
  const {
    item,
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
    <Modal
      isOpen={true}
      onRequestClose={close}
      className={classes.modalContainer}
    >
      <section className={classes.modal}>
        <div className={classes.header}>
          <h3>{item.name}</h3>
          <button onClick={close}>
            <FontAwesomeIcon icon={faWindowClose} size="2x" />
          </button>
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