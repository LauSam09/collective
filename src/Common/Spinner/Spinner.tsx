import cx from "classnames/bind"

import classes from "./Spinner.module.css"

const classnames = cx.bind(classes)

// Inspired by https://dev.to/stephencweiss/create-a-spinner-add-a-loader-in-react-4ic2
export function Spinner() {
  return <div className={classes.spinner} />
}

export function FullPageSpinner() {
  return <div className={classnames(classes.spinner, classes.fullPage)} />
}
