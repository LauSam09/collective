import React, { useContext } from "react"
import { Redirect } from "react-router-dom"

import Login from "./Login"
import { AuthenticationContext } from "authentication"
import { UserState } from "models"

import classes from "./Home.module.css"

export default function Home() {
  const { authenticated, userState } = useContext(AuthenticationContext)

  return (
    <>
      {userState === UserState.Registered ? (
        <Redirect to="/lists" />
      ) : (
        <header className={classes.appHeader}>
          {!authenticated && <Login />}
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
