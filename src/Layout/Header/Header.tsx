import { Link, NavLink } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons"

import { useAuth, useIsRegistered } from "Authentication"

import classes from "./Header.module.css"

export const Header = () => {
  const { logout } = useAuth()

  return (
    <header className={classes.header}>
      <nav>
        <Link to="/">
          <h3 className={classes.brand}>Collective</h3>
        </Link>
        {useIsRegistered() ? (
          <div className={classes.links}>
            <NavLink activeClassName={classes.active} to="/list" title="List">
              List
            </NavLink>
            <NavLink
              activeClassName={classes.active}
              to="/recipes"
              title="Recipes"
            >
              Recipes
            </NavLink>
            <button onClick={logout} title="Log out" className={classes.logout}>
              <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
            </button>
          </div>
        ) : null}
      </nav>
    </header>
  )
}
