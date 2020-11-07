import React from "react"

import classes from "./Button.module.css"

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

export default function Button(props: ButtonProps) {
  const { children, ...buttonProps } = props
  return (
    <button {...buttonProps} className={classes.button}>
      {children}
    </button>
  )
}
