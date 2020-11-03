import React, { useContext } from "react"

import { AuthenticationContext } from "authentication/AuthenticationContext"

import classes from "./Login.module.css"

export default function Login() {
  const { login } = useContext(AuthenticationContext)

  return (
    <div className={classes.container}>
      <p>Log in to get started</p>
      <button onClick={login}>Login</button>
    </div>
  )
}
