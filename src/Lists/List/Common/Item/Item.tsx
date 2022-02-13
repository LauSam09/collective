import { ReactNode } from "react"
import cx from "classnames/bind"

import { CategoryButton } from "../CategoryButton"

import classes from "./Item.module.css"

const classnames = cx.bind(classes)

interface ItemProps {
  buttonColour: string
  onClickCategory?: () => void
  children?: ReactNode
  contentClassName?: string
}

export const Item = (props: ItemProps) => {
  const { buttonColour, onClickCategory, children, contentClassName } = props

  return (
    <div className={classes.container}>
      <div className={classnames(classes.content, contentClassName)}>
        {children}
      </div>
      <CategoryButton buttonColour={buttonColour} onClick={onClickCategory} />
    </div>
  )
}

Item.defaultProps = {
  buttonColour: "var(--colour-background-tertiary)",
}
