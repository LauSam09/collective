import React, { useContext } from "react"

import { AuthenticationContext } from "authentication/AuthenticationContext"

import classes from "./Navigation.module.css"

export default function Navigation() {
  const { authenticated, login, logout } = useContext(AuthenticationContext)

  return (
    <div className={classes.container}>
      <p>Collective</p>
      {authenticated ? (
        <button onClick={logout}>Log out</button>
      ) : (
        <button onClick={login}>Log in</button>
      )}
    </div>
  )
}
