import React, { useContext } from "react"

import { Lists } from "components"

import { AuthenticationContext } from "authentication/AuthenticationContext"
import { UserState } from "models"

import classes from "./Home.module.css"

export default function Home() {
  const { authenticated, userState } = useContext(AuthenticationContext)

  return (
    <>
      {userState === UserState.Registered ? (
        <Lists />
      ) : (
        <header className={classes.appHeader}>
          {!authenticated && <p>Log in to get started</p>}
          {userState === UserState.Unregistered && (
            <span>
              Looks like you aren&apos;t registered yet! Speak to an
              administrator to join a group.
            </span>
          )}
          {userState === UserState.New && <p>Welcome to Collective!</p>}
        </header>
      )}
    </>
  )
}
