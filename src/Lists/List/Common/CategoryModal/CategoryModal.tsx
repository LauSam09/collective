import Modal from "react-modal"

import classes from "./CategoryModal.module.css"

type CategoryModalProps = {
  isOpen: boolean
  close: () => void
}

export function CategoryModal(props: CategoryModalProps) {
  const { isOpen, close } = props

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={close}
      className={classes.modal}
    ></Modal>
  )
}
