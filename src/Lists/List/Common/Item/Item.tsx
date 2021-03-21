import React from "react"

import { CategoryButton } from "../CategoryButton"

import classes from "./Item.module.css"

type ItemProps = {
  buttonColour: string
  onClickCategory?: () => void
  children?: React.ReactNode
}

export function Item(props: ItemProps) {
  const { buttonColour, onClickCategory, children } = props

  return (
    <div className={classes.container}>
      <div className={classes.content}>{children}</div>
      <CategoryButton buttonColour={buttonColour} onClick={onClickCategory} />
    </div>
  )
}

Item.defaultProps = {
  buttonColour: "var(--colour-background-tertiary)",
}
