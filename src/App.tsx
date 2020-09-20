import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import Home from "components/Home"
import Navigation from "components/Navigation"

import classes from "./App.module.css"

function App() {
  return (
    <Router>
      <div className={classes.app}>
        <Navigation />
        <Switch>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
