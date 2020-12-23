import React, { useContext, useState } from "react"
import classNames from "classnames/bind"
import { NavLink } from "react-router-dom"
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
      <NavLink to="/">
        <h2>
          Collective <small>{process.env.REACT_APP_VERSION}</small>
        </h2>
      </NavLink>
      <button
        className={classes.toggle}
        onClick={() => setHideActions((hideActions) => !hideActions)}
      >
        <FontAwesomeIcon icon={faBars} title="Toggle" size="2x" />
      </button>
      <div className={cx("actions", { hidden: hideActions })}>
        <ul>
          {authenticated && (
            <>
              <li onClick={() => setHideActions(true)}>
                <NavLink exact to="/lists">
                  Lists
                </NavLink>
              </li>
              <li onClick={() => setHideActions(true)}>
                <NavLink exact to="/recipes">
                  Recipes
                </NavLink>
              </li>
            </>
          )}

          <li onClick={() => setHideActions(true)}>
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
