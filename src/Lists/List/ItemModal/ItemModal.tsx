import { useEffect, useState } from "react"
import Modal from "react-modal"

import { Item } from "Lists/models"

import classes from "./ItemModal.module.css"
import { useUserContext } from "Authentication"
import { FullPageSpinner } from "Common"

type ItemModalProps = {
  isOpen: boolean
  item: Item | undefined
  close: () => void
}

export function ItemModal(props: ItemModalProps) {
  const { isOpen, item, close } = props
  const [notes, setNotes] = useState(item?.notes)
  const { getDefaultItemsCollection } = useUserContext()
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setSaving(false)
    setNotes(item?.notes)
  }, [item, isOpen])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      await getDefaultItemsCollection().doc(item?.id).update({
        notes,
      })
      close()
    } catch {
      setSaving(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={close}
      closeTimeoutMS={250}
      className={classes.modal}
    >
      <div className={classes.modalBody}>
        {saving ? <FullPageSpinner /> : null}
        <h4>{item?.name}</h4>
        <form onSubmit={handleSubmit}>
          <label>Notes</label>
          <textarea
            disabled={saving}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <h5>Actions</h5>
          <div>
            <button disabled={saving} type="button">
              Remove from list
            </button>
          </div>
          <div>
            <button disabled={saving} type="button">
              Delete permanently
            </button>
          </div>
          <div className={classes.modalActions}>
            <button type="button" onClick={close}>
              Cancel
            </button>
            <button disabled={saving} type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
