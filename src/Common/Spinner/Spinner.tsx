import cx from "classnames/bind"

import classes from "./Spinner.module.css"

const classnames = cx.bind(classes)

interface SpinnerProps {
  className?: string
}

// Inspired by https://dev.to/stephencweiss/create-a-spinner-add-a-loader-in-react-4ic2
export const Spinner = (props: SpinnerProps) => {
  return (
    <div
      role="progressbar"
      className={classnames(classes.spinner, props.className)}
    />
  )
}

export const FullPageSpinner = (props: SpinnerProps) => (
  <Spinner className={classnames(classes.fullPage, props.className)} />
)
