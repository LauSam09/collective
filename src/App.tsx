import React, { useContext } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import { ErrorBoundary, Home, Navigation, Recipes } from "components"
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
              <ErrorBoundary>
                <Switch>
                  <Route path="/recipes" exact>
                    <Recipes />
                  </Route>
                  <Route path="/" exact>
                    <Home />
                  </Route>
                </Switch>
              </ErrorBoundary>
            </main>
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
