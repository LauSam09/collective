import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { Button, Modal, ModalProps } from "Common"
import { ItemModel, useItems } from "Lists"

import classes from "./QuickAddModal.module.css"

export interface QuickAddModalProps extends ModalProps {
  items: ItemModel[]
}

export const QuickAddModal = (props: QuickAddModalProps) => {
  const { isOpen, items, onRequestClose } = props
  const { addItem } = useItems()

  const topUnaddedItems = items
    .filter((i) => !i.added)
    .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
    .slice(0, 10)

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <Modal.Body>
        <Modal.Header>
          <h2>Quick Add</h2>
        </Modal.Header>
        <span>These items are frequently added</span>
        <div className={classes.items}>
          {topUnaddedItems.length === 0 ? (
            <span>No more items to add</span>
          ) : null}
          {topUnaddedItems.map((i, index) => (
            <div key={index} style={{ padding: "5px 0" }}>
              <Button onClick={() => addItem(i.name)} className={classes.add}>
                <FontAwesomeIcon icon={faPlus} size="lg" />
              </Button>
              <span title={`Added ${i.count} times`} className={classes.name}>
                {i.name}
              </span>
            </div>
          ))}
        </div>
        <Modal.Actions>
          <Button mode="primary" onClick={onRequestClose}>
            Close
          </Button>
        </Modal.Actions>
      </Modal.Body>
    </Modal>
  )
}
