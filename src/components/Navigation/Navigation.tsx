import React, { useContext } from "react"

import { AuthenticationContext } from "authentication/AuthenticationContext"

import classes from "./Navigation.module.css"
import { Link } from "react-router-dom"

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
        </ul>
      </div>
      {authenticated ? (
        <button onClick={logout}>Log out</button>
      ) : (
        <button onClick={login}>Log in</button>
      )}
    </div>
  )
}
