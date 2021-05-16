import React from "react"
import RMModal from "react-modal"

import { ModalHeader } from "./ModalHeader"
import { ModalBody } from "./ModalBody"

import classes from "./Modal.module.css"

export interface ModalProps extends ReactModal.Props {
  children?: React.ReactNode
}

export const Modal = (props: ModalProps) => (
  <RMModal closeTimeoutMS={250} className={classes.modal} {...props} />
)

Modal.Body = ModalBody
Modal.Header = ModalHeader
