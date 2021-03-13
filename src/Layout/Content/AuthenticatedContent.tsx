import { Redirect, Route, Switch } from "react-router-dom"

import { useIsRegistered } from "Authentication"
import { JoinHousehold, Register } from "Register"
import { Household } from "Household"
import { RegisteredSplash } from "Splash"
import { CategoriesContextProvider, List, useAddedItems } from "Lists"

function RegisteredContent() {
  const { addedItems } = useAddedItems()

  return (
    <CategoriesContextProvider>
      <Switch>
        <Route path="/household">
          <Household />
        </Route>
        <Route path="/list">
          <List addedItems={addedItems} />
        </Route>
        <Route path="/">
          <RegisteredSplash itemCount={addedItems.length} />
        </Route>
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
