import React, { useContext } from "react"

import { Register, Lists } from "components"

import { AuthenticationContext } from "authentication/AuthenticationContext"
import { UserState } from "models"

import classes from "./Home.module.css"

export default function Home() {
  const { authenticated, userState } = useContext(AuthenticationContext)

  return (
    <>
      <header className={classes.appHeader}>
        {!authenticated && <p>Log in to get started</p>}
        {userState === UserState.Unregistered && <Register />}
        {userState === UserState.New && <p>Welcome to Collective!</p>}
      </header>
      {userState === UserState.Registered && (
        <main>
          <Lists />
        </main>
      )}
    </>
  )
}
