import React, { useContext } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import { Home, Navigation, Recipes } from "components"
import { AuthenticationContext } from "authentication/AuthenticationContext"

import classes from "./App.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons"

function App() {
  const { loaded } = useContext(AuthenticationContext)

  return (
    <Router>
      <div className={classes.app}>
        {loaded ? (
          <>
            <Navigation />
            <main className={classes.content}>
              <Switch>
                <Route path="/recipes" exact>
                  <Recipes />
                </Route>
                <Route path="/" exact>
                  <Home />
                </Route>
              </Switch>
            </main>
          </>
        ) : (
          <div
            className="loader center"
            style={{ textAlign: "center", minHeight: "100vh" }}
          >
            <FontAwesomeIcon
              icon={faCircleNotch}
              className="fa-spin"
              style={{ position: "absolute", top: "50%" }}
            />
          </div>
        )}
      </div>
    </Router>
  )
}

export default App
