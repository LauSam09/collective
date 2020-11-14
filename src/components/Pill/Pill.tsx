import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"

import classes from "./Pill.module.css"

type PillProps = {
  text: string
  remove: () => void
}

export default function Pill(props: PillProps) {
  const { text, remove } = props
  return (
    <div className={classes.pill}>
      <span>{text}</span>
      <button onClick={remove}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  )
}
