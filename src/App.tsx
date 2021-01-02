import React, { useContext } from "react"
import { BrowserRouter as Router } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons"

import { Main, Navigation } from "components"
import { AuthenticationContext } from "authentication"

import classes from "./App.module.css"

function App() {
  const { loaded } = useContext(AuthenticationContext)

  return (
    <Router>
      <div className={classes.app}>
        {loaded ? (
          <>
            <Navigation />
            <Main />
          </>
        ) : (
          <div className={classes.spinner}>
            <FontAwesomeIcon icon={faCircleNotch} className="fa-spin" />
          </div>
        )}
      </div>
    </Router>
  )
}

export default App
