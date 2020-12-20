import React, { PropsWithChildren } from "react"
import ReactModal from "react-modal"

import classes from "./Modal.module.css"

type ModalProps = ReactModal.Props & PropsWithChildren<unknown>

export default function Modal(props: ModalProps) {
  const { children, ...rest } = props
  return (
    <ReactModal {...rest} className={classes.modal}>
      <section className={classes.modalBody}>{props.children}</section>
    </ReactModal>
  )
}
