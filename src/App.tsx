import React, { useContext } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import Home from "components/Home"
import Navigation from "components/Navigation"
import { AuthenticationContext } from "authentication/AuthenticationContext"

import classes from "./App.module.css"

function App() {
  const { initialised } = useContext(AuthenticationContext)

  return (
    <Router>
      <div className={classes.app}>
        {initialised ? (
          <>
            <Navigation />
            <Switch>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </>
        ) : (
          <div
            className="loader center"
            style={{ textAlign: "center", minHeight: "100vh" }}
          >
            <i
              className="fa fa-cog fa-spin"
              style={{ position: "absolute", top: "50%" }}
            />
          </div>
        )}
      </div>
    </Router>
  )
}

export default App
