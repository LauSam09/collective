import React, { useContext, useState } from "react"
import classNames from "classnames/bind"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBars,
  faSignInAlt,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons"

import { AuthenticationContext } from "authentication/AuthenticationContext"

import classes from "./Navigation.module.css"

const cx = classNames.bind(classes)

export default function Navigation() {
  const { authenticated, login, logout } = useContext(AuthenticationContext)
  const [hideActions, setHideActions] = useState(true)

  return (
    <div className={classes.container}>
      <Link to="/">
        <h2>Collective</h2>
      </Link>
      <button
        className={classes.toggle}
        onClick={() => setHideActions((hideActions) => !hideActions)}
      >
        <FontAwesomeIcon icon={faBars} title="Toggle" size="2x" />
      </button>
      <div className={cx("actions", { hidden: hideActions })}>
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
