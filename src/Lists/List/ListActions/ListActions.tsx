import { faEye, faEyeSlash, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Dispatch, SetStateAction } from "react"

import { Button } from "Common"

import classes from "./ListActions.module.css"

type ListActionsProps = {
  showCompleted: boolean
  setShowCompleted: Dispatch<SetStateAction<boolean>>
  clearCompleted: () => void
}

export function ListActions(props: ListActionsProps) {
  const { showCompleted, clearCompleted, setShowCompleted } = props

  return (
    <div className={classes.container}>
      <Button
        title={showCompleted ? "Hide completed" : "Show completed"}
        onClick={() => setShowCompleted((old) => !old)}
        className={classes.toggle}
      >
        <FontAwesomeIcon icon={showCompleted ? faEye : faEyeSlash} size="lg" />
      </Button>
      <Button
        title="Clear completed"
        onClick={clearCompleted}
        className={classes.clear}
      >
        <FontAwesomeIcon icon={faTrash} size="lg" />
      </Button>
    </div>
  )
}
