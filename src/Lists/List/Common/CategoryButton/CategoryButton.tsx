import React, { useState } from "react"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import classes from "./CategoryButton.module.css"
import { CategoryModal } from "../CategoryModal"

type CategoryButtonProps = {
  buttonColour: string
}

export function CategoryButton(props: CategoryButtonProps) {
  const { buttonColour } = props

  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <CategoryModal isOpen={isModalOpen} close={() => setIsModalOpen(false)} />
      <button
        className={classes.button}
        type="button"
        onClick={() => setIsModalOpen(true)}
        style={{ backgroundColor: buttonColour || "inherit" }}
      >
        <FontAwesomeIcon icon={faBars} size="2x" />
      </button>
    </>
  )
}
