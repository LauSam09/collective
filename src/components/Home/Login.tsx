import React, { useContext } from "react"
import GoogleButton from "react-google-button"

import { AuthenticationContext } from "authentication"

import classes from "./Login.module.css"

export default function Login() {
  const { login } = useContext(AuthenticationContext)

  return (
    <div className={classes.container}>
      <p>Log in to get started</p>
      <GoogleButton onClick={login} type="dark" />
    </div>
  )
}
