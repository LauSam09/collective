import RMModal from "react-modal"

import classes from "./Modal.module.css"

type ModalHeaderProps = {
  children?: React.ReactNode
}

function ModalHeader(props: ModalHeaderProps) {
  const { children } = props

  return <h4>{children}</h4>
}

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
