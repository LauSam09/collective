import React from "react"
import { faWindowClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"

import { Button, Modal } from "components"
import { RootState } from "store"
import { Item } from "models"

import classes from "./ItemModal.module.css"

type Props = {
  item: Item
  open: boolean
  close: () => void
  removeItem: () => Promise<void>
  deleteItem: () => Promise<void>
  updateItem: (item: Item) => Promise<void>
}

export default function ItemModal(props: Props) {
  const { item, open, close, removeItem, deleteItem, updateItem } = props
  const categories = useSelector(
    (state: RootState) => state.categoryState.categories
  )
  const { register, formState, handleSubmit } = useForm({
    defaultValues: item,
    mode: "onChange",
  })
  const { isDirty } = formState

  async function handleRemoveItem() {
    await removeItem()
    close()
  }

  async function handleDeleteItem() {
    await deleteItem()
    close()
  }

  function handleClose() {
    close()
  }

  async function onSubmit(data: Item) {
    if (data.category === "-") {
      delete data.category
    }
    await updateItem({ ...item, ...data })
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>Category</label>
            <select ref={register} name="category">
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
            <textarea ref={register} name="notes" />
          </div>
          <div className={classes.actions}>
            <label>Actions</label>
            <button type="button" onClick={handleRemoveItem}>
              Remove From List
            </button>
            <button
              type="button"
              onClick={handleDeleteItem}
              style={{ color: "red" }}
            >
              Delete
            </button>
          </div>
          <div className={classes.modalActions}>
            <Button onClick={handleClose} type="button">
              Cancel
            </Button>
            <Button disabled={!isDirty} type="submit">
              Save
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
