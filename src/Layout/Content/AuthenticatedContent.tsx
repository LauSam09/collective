import { Route, Switch } from "react-router-dom"

import { useUser, useIsRegistered } from "Authentication"
import Register from "Register"

export default function AuthenticatedContent() {
  const user = useUser()
  const isRegistered = useIsRegistered()

  return isRegistered ? (
    <Switch>
      <Route path="/household">
        <span>Household</span>
      </Route>
      <Route path="/">
        <span>Welcome back, {user?.displayName}</span>
      </Route>
    </Switch>
  ) : (
    <Register />
  )
}
