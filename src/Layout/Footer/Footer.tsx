import classes from "./Footer.module.css"

export function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <footer className={classes.footer}>
      <small>&copy; Copyright {currentYear}, Collective</small>
    </footer>
  )
}
