import { faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import classes from "./CategoryButton.module.css"

interface CategoryButtonProps {
  onClick?: () => void
  buttonColour: string
}

export const CategoryButton = (props: CategoryButtonProps) => {
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
