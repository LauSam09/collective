import classes from "./ModalBody.module.css"

export interface ModalBodyProps {
  children?: React.ReactNode
}

export const ModalBody = (props: ModalBodyProps) => {
  const { children } = props

  return <div className={classes.modalBody}>{children}</div>
}
