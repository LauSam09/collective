import { Redirect, Route, Switch } from "react-router-dom"
import { AnonymousSplash } from "Splash"

export const AnonymousContent = () => (
  <Switch>
    <Route path="/" exact>
      <AnonymousSplash />
    </Route>
    <Redirect to="/" />
  </Switch>
)
