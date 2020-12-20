import React, { useEffect, useState } from "react"
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
  removeItem: () => Promise<void>
  deleteItem: () => Promise<void>
}

export default function ItemModal(props: Props) {
  const { item, open, close, categories, removeItem, deleteItem } = props
  const [category, setCategory] = useState(item.category)
  const [notes, setNotes] = useState(item.notes || "")

  useEffect(() => {
    setNotes(item?.notes || "")
  }, [item])

  async function handleSetCategory(category: string) {
    setCategory(category)
  }

  async function handleRemoveItem() {
    await removeItem()
    close()
  }

  async function handleDeleteItem() {
    await deleteItem()
    close()
  }

  async function handleClose() {
    close()
  }

  return (
    <Modal isOpen={open} onRequestClose={handleClose} closeTimeoutMS={250}>
      <div className={classes.header}>
        <h3 title={item?.name}>{item?.name}</h3>
        <Button onClick={handleClose}>
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
        <div className={classes.notes}>
          <label>Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div className={classes.actions}>
          <label>Actions</label>
          <button onClick={handleRemoveItem}>Remove From List</button>
          <button onClick={handleDeleteItem} style={{ color: "red" }}>
            Delete
          </button>
        </div>
        <div className={classes.modalActions}>
          {/* <div style={{ flexGrow: 1 }} /> */}
          <Button>Cancel</Button>
          <Button>Save</Button>
        </div>
      </div>
    </Modal>
  )
}
