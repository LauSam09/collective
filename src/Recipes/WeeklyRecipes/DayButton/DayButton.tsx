import cx from "classnames/bind"

import classes from "./DayButton.module.css"

const classnames = cx.bind(classes)

export interface DayButtonProps {
  day: string
  count: number
  selected: boolean
  onClick: () => void
}

export const DayButton = (props: DayButtonProps) => {
  const { count, day, selected, onClick } = props

  return (
    <button
      onClick={onClick}
      className={classnames(classes.dayButton, { selected })}
    >
      <span>{day}</span>
      {count > 0 ? <span className={classes.count}>{count}</span> : null}
    </button>
  )
}
