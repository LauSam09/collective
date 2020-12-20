import React from "react"
import { faWindowClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { Button, Modal } from "components"

import classes from "./CategoryModal.module.css"

type CategoryModalProps = {
  isOpen: boolean
  name: string
  close: () => void
}

export default function CategoryModal(props: CategoryModalProps) {
  const { isOpen, name, close } = props

  return (
    <Modal isOpen={isOpen} onRequestClose={close} closeTimeoutMS={250}>
      {/* TODO move section to modal component */}
      <section className={classes.modal}>
        <div className={classes.header}>
          <h3 title={name}>{name}</h3>
          <Button onClick={close}>
            <FontAwesomeIcon icon={faWindowClose} size="2x" />
          </Button>
        </div>
        <div></div>
      </section>
    </Modal>
  )
}
