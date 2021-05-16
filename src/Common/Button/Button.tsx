import { DetailedHTMLProps } from "react"
import cx from "classnames/bind"

import classes from "./Button.module.css"

const classnames = cx.bind(classes)

export interface ButtonProps
  extends DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  mode: "primary" | "secondary" | "default"
}

export const Button = (props: ButtonProps) => {
  const { className, mode, ...buttonProps } = props

  return (
    <button
      {...buttonProps}
      className={classnames(classes.button, className, [mode])}
    />
  )
}

Button.defaultProps = {
  mode: "default",
}
