import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBars,
  faSignInAlt,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons"

import { AuthenticationContext } from "authentication/AuthenticationContext"

import classes from "./Navigation.module.css"

export default function Navigation() {
  const { authenticated, login, logout } = useContext(AuthenticationContext)

  return (
    <div className={classes.container}>
      <h2>Collective</h2>
      <div className={classes.actions}>
        <ul>
          <li>
            <Link to="/">Lists</Link>
          </li>
          <li>
            <Link to="/recipes">Recipes</Link>
          </li>
          <li>
            {authenticated ? (
              <FontAwesomeIcon
                icon={faSignOutAlt}
                onClick={logout}
                title="Log out"
              />
            ) : (
              <FontAwesomeIcon
                icon={faSignInAlt}
                onClick={login}
                title="Log in"
              />
            )}
          </li>
        </ul>
      </div>
      <button className={classes.toggle}>
        <FontAwesomeIcon icon={faBars} title="Toggle" size="2x" />
      </button>
    </div>
  )
}
