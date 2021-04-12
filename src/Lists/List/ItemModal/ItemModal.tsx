import { useEffect, useState } from "react"

import { Modal } from "Common"
import { useItems } from "Lists"
import { Item } from "Lists/models"

import classes from "./ItemModal.module.css"

type ItemModalProps = {
  isOpen: boolean
  item: Item | undefined
  close: () => void
}

export function ItemModal(props: ItemModalProps) {
  const { isOpen, item, close } = props
  const [notes, setNotes] = useState(item?.notes)
  const { deleteItem, removeItem, updateItem } = useItems()

  useEffect(() => {
    // Prevents old values being displayed when modal fades out.
    if (isOpen) {
      setNotes(item?.notes)
    }
  }, [item, isOpen])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (notes !== item?.notes && item?.id) {
      await updateItem(item.id, {
        notes,
      })
    }
    close()
  }

  async function handleRemove() {
    item?.id && (await removeItem(item.id))
    close()
  }

  async function handleDelete() {
    item?.id && (await deleteItem(item?.id))
    close()
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={close}>
      <Modal.Body>
        <Modal.Header>{item?.name}</Modal.Header>
        <form onSubmit={handleSubmit}>
          <label>Notes</label>
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={classes.input}
          />
          <h5>Actions</h5>
          <div>
            <button type="button" onClick={handleRemove}>
              Remove from list
            </button>
          </div>
          <div>
            <button type="button" onClick={handleDelete}>
              Delete permanently
            </button>
          </div>
          <div className={classes.modalActions}>
            <button type="button" onClick={close}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}
