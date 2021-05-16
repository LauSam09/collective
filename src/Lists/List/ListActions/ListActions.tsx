import {
  faBolt,
  faEye,
  faEyeSlash,
  faTrash,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Dispatch, SetStateAction, useState } from "react"

import { Button } from "Common"
import { ItemModel, useItems } from "Lists"

import { QuickAddModal } from "./QuickAddModal"

import classes from "./ListActions.module.css"

interface ListActionsProps {
  disableClearCompleted: boolean
  items: ItemModel[]
  showCompleted: boolean
  clearCompleted: () => void
  setShowCompleted: Dispatch<SetStateAction<boolean>>
}

export const ListActions = (props: ListActionsProps) => {
  const {
    disableClearCompleted,
    items,
    showCompleted,
    clearCompleted,
    setShowCompleted,
  } = props
  useItems()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <QuickAddModal
        isOpen={modalOpen}
        items={items}
        onRequestClose={() => setModalOpen(false)}
      />
      <div className={classes.container}>
        <Button
          title="Quick add"
          onClick={() => setModalOpen(true)}
          className={classes.quickAdd}
        >
          <FontAwesomeIcon icon={faBolt} size="lg" />
        </Button>
        <Button
          title={showCompleted ? "Hide completed" : "Show completed"}
          onClick={() => setShowCompleted((old) => !old)}
          className={classes.toggle}
        >
          <FontAwesomeIcon
            icon={showCompleted ? faEye : faEyeSlash}
            size="lg"
          />
        </Button>
        <Button
          title="Clear completed"
          onClick={clearCompleted}
          disabled={disableClearCompleted}
          className={classes.clear}
        >
          <FontAwesomeIcon icon={faTrash} size="lg" />
        </Button>
      </div>
    </>
  )
}
