import { FunctionComponent } from "react"

import classes from "./ModalActions.module.css"

export const ModalActions: FunctionComponent = (props) => {
  const { children } = props

  return <div className={classes.actions}>{children}</div>
}
