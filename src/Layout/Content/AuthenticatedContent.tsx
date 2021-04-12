import { Redirect, Route, Switch } from "react-router-dom"

import { useIsRegistered } from "Authentication"
import { JoinHousehold, Register } from "Register"
import { Household } from "Household"
import { RegisteredSplash } from "Splash"
import { CategoriesContextProvider, List, useItemSubscription } from "Lists"
import { Recipes } from "Recipes"

function RegisteredContent() {
  const { addedItems, unaddedItems } = useItemSubscription()

  return (
    <CategoriesContextProvider>
      <Switch>
        <Route path="/household" exact>
          <Household />
        </Route>
        <Route path="/recipes" exact>
          <Recipes addedItems={addedItems} />
        </Route>
        <Route path="/list" exact>
          <List addedItems={addedItems} unaddedItems={unaddedItems} />
        </Route>
        <Route path="/" exact>
          <RegisteredSplash itemCount={addedItems.length} />
        </Route>
        <Redirect to="/" />
      </Switch>
    </CategoriesContextProvider>
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
