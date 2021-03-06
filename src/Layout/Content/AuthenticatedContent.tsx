import { Redirect, Route, Switch } from "react-router-dom"

import { useIsRegistered } from "Authentication"
import { JoinHousehold, Register } from "Register"
import { Household } from "Household"
import { RegisteredSplash } from "Splash"
import { List } from "Lists"

function RegisteredContent() {
  return (
    <Switch>
      <Route path="/household">
        <Household />
      </Route>
      <Route path="/list">
        <List />
      </Route>
      <Route path="/">
        <RegisteredSplash />
      </Route>
    </Switch>
  )
}

function UnregisteredContent() {
  return (
    <Switch>
      <Route path="/join/:id" exact>
        <JoinHousehold />
      </Route>
      <Route path="/register" exact>
        <Register />
      </Route>
      <Redirect to="/register" />
    </Switch>
  )
}

export function AuthenticatedContent() {
  return useIsRegistered() ? <RegisteredContent /> : <UnregisteredContent />
}
