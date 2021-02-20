import classes from "./Header.module.css"

export default function Header() {
  return (
    <header className={classes.header}>
      <nav>
        <a href="/">Collective</a>
      </nav>
    </header>
  )
}
