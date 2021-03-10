import React from "react"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import classes from "./Item.module.css"

type ItemProps = {
  buttonColour?: string
  children?: React.ReactNode
}

export function Item(props: ItemProps) {
  const { buttonColour, children } = props

  return (
    <div className={classes.container}>
      <div className={classes.content}>{children}</div>
      <button
        className={classes.button}
        style={{ backgroundColor: buttonColour || "inherit" }}
      >
        <FontAwesomeIcon icon={faBars} size="2x" />
      </button>
    </div>
  )
}

Item.defaultProps = {
  buttonColour: "#dedede",
}
