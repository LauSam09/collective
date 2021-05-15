import { Button } from "Common"

import { Modal, ModalProps } from "../Modal"

import classes from "./ConfirmationModal.module.css"

export interface ConfirmationModalProps extends Omit<ModalProps, "children"> {
  text: string
  onClickCancel: () => void
  onClickConfirm: () => void
}

export const ConfirmationModal = (props: ConfirmationModalProps) => {
  const { text, onClickCancel, onClickConfirm, ...modalProps } = props

  return (
    <Modal onRequestClose={onClickCancel} {...modalProps}>
      <h3>Confirm</h3>
      <p>{text}</p>
      <div className={classes.actions}>
        <Button onClick={onClickCancel} className={classes.secondaryButton}>
          Cancel
        </Button>
        <Button onClick={onClickConfirm}>Confirm</Button>
      </div>
    </Modal>
  )
}
