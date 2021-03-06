import cx from "classnames/bind"

import classes from "./Spinner.module.css"

const classnames = cx.bind(classes)

type SpinnerProps = {
  className?: string
}

// Inspired by https://dev.to/stephencweiss/create-a-spinner-add-a-loader-in-react-4ic2
export function Spinner(props: SpinnerProps) {
  return (
    <div
      role="progressbar"
      className={classnames(classes.spinner, props.className)}
    />
  )
}

export function FullPageSpinner(props: SpinnerProps) {
  return <Spinner className={classnames(classes.fullPage, props.className)} />
}
