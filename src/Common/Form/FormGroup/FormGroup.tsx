import cx from "classnames/bind"

import classes from "./FormGroup.module.css"

const classnames = cx.bind(classes)

export const FormGroup = (
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
) => (
  <div {...props} className={classnames(classes.formGroup, props.className)} />
)
