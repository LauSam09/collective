import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"

import classes from "./Pill.module.css"

type PillProps = {
  text: string
  remove: () => void
  icon?: JSX.Element
}

export default function Pill(props: PillProps) {
  const { text, remove, icon } = props

  return (
    <div className={classes.pill}>
      <span>{text}</span>
      <button type="button" onClick={remove}>
        {icon || <FontAwesomeIcon icon={faTimes} />}
      </button>
    </div>
  )
}
