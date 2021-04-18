import RMModal from "react-modal"

import { ModalHeader } from "./ModalHeader"

import classes from "./Modal.module.css"

type ModalBodyProps = {
  children?: React.ReactNode
}

function ModalBody(props: ModalBodyProps) {
  const { children } = props

  return <div className={classes.modalBody}>{children}</div>
}

type ModalProps = ReactModal.Props & {
  children?: React.ReactNode
}

export function Modal(props: ModalProps) {
  return <RMModal closeTimeoutMS={250} className={classes.modal} {...props} />
}

Modal.Body = ModalBody
Modal.Header = ModalHeader
