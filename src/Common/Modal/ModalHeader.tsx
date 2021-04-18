import classes from "./ModalHeader.module.css"

type ModalHeaderProps = {
  children?: React.ReactNode
}

export function ModalHeader(props: ModalHeaderProps) {
  const { children } = props

  return <h4 className={classes.header}>{children}</h4>
}
