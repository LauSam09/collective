import { useEffect, useState } from "react"

import { Button, Modal } from "Common"
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
            placeholder="Notes"
            onChange={(e) => setNotes(e.target.value)}
            className={classes.input}
          />
          <h5 className={classes.actions}>Actions</h5>
          <div>
            <Button type="button" onClick={handleRemove}>
              Remove from list
            </Button>
          </div>
          <div>
            <Button type="button" onClick={handleDelete}>
              Delete permanently
            </Button>
          </div>
          <div className={classes.modalActions}>
            <Button
              type="button"
              onClick={close}
              className={classes.secondaryButton}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}
