import { useAuth, useIsAuthenticated } from "Authentication"
import classes from "./Header.module.css"

export default function Header() {
  const { logout } = useAuth()

  return (
    <header className={classes.header}>
      <nav>
        <a href="/">Collective</a>
        {useIsAuthenticated() ? <button onClick={logout}>Logout</button> : null}
      </nav>
    </header>
  )
}
