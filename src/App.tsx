import React, { useContext } from "react"

import { AuthenticationContext } from "authentication/AuthenticationContext"
import { UserState } from "models"

import Register from "components/Register"
import Navigation from "components/Navigation"

import classes from "./App.module.css"

function App() {
  const { authenticated, userState, group } = useContext(AuthenticationContext)

  return (
    <div className={classes.app}>
      <Navigation />
      <header className={classes.appHeader}>
        {!authenticated && <p>Log in to get started</p>}
        {userState === UserState.Registered && (
          <p>Welcome back [{group?.name}]</p>
        )}
        {userState === UserState.Unregistered && <Register />}
        {userState === UserState.New && <p>Welcome to Collective!</p>}
      </header>
    </div>
  )
}

export default App
