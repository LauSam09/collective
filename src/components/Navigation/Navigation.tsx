import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSignInAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons"

import { AuthenticationContext } from "authentication/AuthenticationContext"

import classes from "./Navigation.module.css"

export default function Navigation() {
  const { authenticated, login, logout } = useContext(AuthenticationContext)

  return (
    <div className={classes.container}>
      <p>Collective</p>
      <div>
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
    </div>
  )
}
