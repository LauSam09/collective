import classes from "./Footer.module.css"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <footer className={classes.footer}>
      <small>&copy; Copyright {currentYear}, Collective</small>
    </footer>
  )
}
