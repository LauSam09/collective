import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons"

import { useAuth, useIsRegistered } from "Authentication"

import classes from "./Header.module.css"

export function Header() {
  const { logout } = useAuth()

  return (
    <header className={classes.header}>
      <nav>
        <Link to="/">
          <h3 className={classes.brand}>Collective</h3>
        </Link>
        {useIsRegistered() ? (
          <div className={classes.links}>
            <Link to="/list" title="List">
              List
            </Link>
            <Link to="/household" title="Household">
              Household
            </Link>
            <button onClick={logout} title="Log out" className={classes.logout}>
              <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
            </button>
          </div>
        ) : null}
      </nav>
    </header>
  )
}
