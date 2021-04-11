import { useEffect, useState } from "react"
import firebase from "firebase"

import { Modal } from "Common"
import { Item } from "Lists/models"
import { useUserContext } from "Authentication"

import classes from "./ItemModal.module.css"

type ItemModalProps = {
  isOpen: boolean
  item: Item | undefined
  close: () => void
}

export function ItemModal(props: ItemModalProps) {
  const { isOpen, item, close } = props
  const [notes, setNotes] = useState(item?.notes)
  const { getDefaultItemsCollection } = useUserContext()

  useEffect(() => {
    // Prevents old values being displayed when modal fades out.
    if (isOpen) {
      setNotes(item?.notes)
    }
  }, [item, isOpen])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (notes !== item?.notes) {
      await getDefaultItemsCollection().doc(item?.id).update({
        notes,
      })
    }
    close()
  }

  async function handleRemove() {
    await getDefaultItemsCollection().doc(item?.id).update({
      completed: false,
      added: false,
      notes: firebase.firestore.FieldValue.delete(),
    })
    close()
  }

  async function handleDelete() {
    await getDefaultItemsCollection().doc(item?.id).delete()
    close()
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={close}>
      <div className={classes.modalBody}>
        <h4>{item?.name}</h4>
        <form onSubmit={handleSubmit}>
          <label>Notes</label>
          <input value={notes} onChange={(e) => setNotes(e.target.value)} />
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
      </div>
    </Modal>
  )
}
