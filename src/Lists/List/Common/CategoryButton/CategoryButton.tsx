import React from "react"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import classes from "./CategoryButton.module.css"

type CategoryButtonProps = {
  onClick?: () => void
  buttonColour: string
}

export function CategoryButton(props: CategoryButtonProps) {
  const { buttonColour, onClick } = props

  return (
    <>
      <button
        className={classes.button}
        type="button"
        onClick={onClick}
        style={{ backgroundColor: buttonColour || "inherit" }}
      >
        <FontAwesomeIcon icon={faBars} size="2x" />
      </button>
    </>
  )
}
