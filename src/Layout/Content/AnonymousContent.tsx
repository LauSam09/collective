import { Redirect, Route, Switch } from "react-router-dom"
import { AnonymousSplash } from "Splash"

export function AnonymousContent() {
  return (
    <Switch>
      <Route path="/" exact>
        <AnonymousSplash />
      </Route>
      <Redirect to="/" />
    </Switch>
  )
}
