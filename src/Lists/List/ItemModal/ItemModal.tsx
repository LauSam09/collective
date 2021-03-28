import { Item } from "Lists/models"
import { useEffect, useState } from "react"
import Modal from "react-modal"

import classes from "./ItemModal.module.css"

type ItemModalProps = {
  isOpen: boolean
  item: Item | undefined
  close: () => void
}

export function ItemModal(props: ItemModalProps) {
  const { isOpen, item, close } = props
  const [notes, setNotes] = useState(item?.notes)

  useEffect(() => {
    setNotes(item?.notes)
  }, [item])

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={close}
      closeTimeoutMS={250}
      className={classes.modal}
    >
      <div className={classes.modalBody}>
        <h4>{item?.name}</h4>
        <form>
          <label>Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          <h5>Actions</h5>
          <div>
            <button type="button">Remove from list</button>
          </div>
          <div>
            <button type="button">Delete permanently</button>
          </div>
          <div className={classes.modalActions}>
            <button type="button" onClick={close}>
              Cancel
            </button>
            <button>Save</button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
