import { Item } from "models"
import React from "react"
import Modal from "react-modal"

import classes from "./EditModal.module.css"

type Props = {
  item: Item
  close: () => void
}

export default function EditModal(props: Props) {
  const { item, close } = props
  return (
    <Modal isOpen={true} onRequestClose={close} className={classes.modal}>
      <div>
        <h3>{item.name}</h3>
      </div>
    </Modal>
  )
}
