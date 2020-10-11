import React, { useContext } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import { Home, Navigation, Recipes } from "components"
import { AuthenticationContext } from "authentication/AuthenticationContext"

import classes from "./App.module.css"

function App() {
  const { loaded } = useContext(AuthenticationContext)

  return (
    <Router>
      <div className={classes.app}>
        {loaded ? (
          <>
            <Navigation />
            <Switch>
              <Route path="/recipes" exact>
                <Recipes />
              </Route>
              <Route path="/" exact>
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
