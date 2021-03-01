import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons"

import { useAuth, useIsAuthenticated } from "Authentication"

import classes from "./Header.module.css"

export default function Header() {
  const { logout } = useAuth()

  return (
    <header className={classes.header}>
      <nav>
        <a href="/">Collective</a>
        {useIsAuthenticated() ? (
          <button onClick={logout} title="Log out" className={classes.logout}>
            <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
          </button>
        ) : null}
      </nav>
    </header>
  )
}
