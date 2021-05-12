import classes from "./Footer.module.css"

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={classes.footer}>
      <small>&copy; Copyright {currentYear}, Collective</small>
    </footer>
  )
}
