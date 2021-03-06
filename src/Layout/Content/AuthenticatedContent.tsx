import { Redirect, Route, Switch } from "react-router-dom"

import { useUser, useIsRegistered } from "Authentication"
import Register, { JoinHousehold } from "Register"
import { Household } from "Household"

function RegisteredContent() {
  return (
    <Switch>
      <Route path="/household">
        <Household />
      </Route>
      <Route path="/">
        <span>Welcome back, {useUser()?.displayName}</span>
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
      <Route path="/">
        <Redirect to="/register" />
      </Route>
    </Switch>
  )
}

export default function AuthenticatedContent() {
  return useIsRegistered() ? <RegisteredContent /> : <UnregisteredContent />
}
