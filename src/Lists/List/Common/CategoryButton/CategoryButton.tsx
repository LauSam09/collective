import React from "react"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import classes from "./CategoryButton.module.css"

type CategoryButtonProps = {
  buttonColour: string
}

export function CategoryButton(props: CategoryButtonProps) {
  const { buttonColour } = props

  return (
    <button
      className={classes.button}
      style={{ backgroundColor: buttonColour || "inherit" }}
    >
      <FontAwesomeIcon icon={faBars} size="2x" />
    </button>
  )
}
