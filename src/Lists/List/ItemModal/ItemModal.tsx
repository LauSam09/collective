import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons"
import cx from "classnames/bind"

import { Button, Modal } from "Common"
import { useItems } from "Lists"
import { Item } from "Lists/models"

import classes from "./ItemModal.module.css"

const classnames = cx.bind(classes)

type ItemModalProps = {
  isOpen: boolean
  item: Item | undefined
  close: () => void
}

export function ItemModal(props: ItemModalProps) {
  const { isOpen, item, close } = props
  const [notes, setNotes] = useState(item?.notes)
  const [flagged, setFlagged] = useState(item?.flagged)
  const { deleteItem, removeItem, setItemFlag, updateItem } = useItems()

  useEffect(() => {
    // Prevents old values being displayed when modal fades out.
    if (isOpen) {
      setNotes(item?.notes)
      setFlagged(item?.flagged)
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

  function handleFlag() {
    setFlagged((f) => !f)
    item?.id && setItemFlag(item.id, !flagged)
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={close}>
      <Modal.Body>
        <Modal.Header className={classes.header}>
          <h4>{item?.name}</h4>
          <Button
            type="button"
            title={flagged ? "Item flagged" : "Flag item"}
            onClick={handleFlag}
            className={classnames(classes.flagButton, {
              [classes.flagged]: flagged,
            })}
          >
            <FontAwesomeIcon icon={faExclamationCircle} size="lg" />
          </Button>
        </Modal.Header>
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
