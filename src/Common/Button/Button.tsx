import cx from "classnames/bind"

import classes from "./Button.module.css"

const classnames = cx.bind(classes)

export function Button(
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) {
  return (
    <button
      {...props}
      className={classnames(classes.button, props.className)}
    />
  )
}
