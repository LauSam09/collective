import RMModal from "react-modal"

import classes from "./Modal.module.css"

type ModalProps = ReactModal.Props & {
  children?: React.ReactNode
}

export function Modal(props: ModalProps) {
  return <RMModal closeTimeoutMS={250} className={classes.modal} {...props} />
}
