import RMModal from "react-modal"

import { ModalHeader } from "./ModalHeader"

import classes from "./Modal.module.css"
import React from "react"

interface ModalBodyProps {
  children?: React.ReactNode
}

const ModalBody = (props: ModalBodyProps) => {
  const { children } = props

  return <div className={classes.modalBody}>{children}</div>
}

export interface ModalProps extends ReactModal.Props {
  children?: React.ReactNode
}

export const Modal = (props: ModalProps) => (
  <RMModal closeTimeoutMS={250} className={classes.modal} {...props} />
)

Modal.Body = ModalBody
Modal.Header = ModalHeader
