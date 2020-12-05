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
import packageJson from "../../../package.json"

import classes from "./Navigation.module.css"

const cx = classNames.bind(classes)

export default function Navigation() {
  const { authenticated, login, logout } = useContext(AuthenticationContext)
  const [hideActions, setHideActions] = useState(true)

  return (
    <div className={classes.container}>
      <Link to="/">
        <h2>
          Collective <small>{packageJson.version}</small>
        </h2>
      </Link>
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
                <Link to="/">Lists</Link>
              </li>
              <li onClick={() => setHideActions(true)}>
                <Link to="/recipes">Recipes</Link>
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
