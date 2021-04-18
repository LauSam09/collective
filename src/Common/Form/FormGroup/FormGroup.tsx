import cx from "classnames/bind"

import classes from "./FormGroup.module.css"

const classnames = cx.bind(classes)

export function FormGroup(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
) {
  return (
    <div
      {...props}
      className={classnames(classes.formGroup, props.className)}
    />
  )
}
