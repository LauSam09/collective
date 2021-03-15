import { Redirect, Route, Switch } from "react-router-dom"

import { useIsRegistered } from "Authentication"
import { JoinHousehold, Register } from "Register"
import { Household } from "Household"
import { RegisteredSplash } from "Splash"
import { CategoriesContextProvider, List, useAddedItems } from "Lists"

function RegisteredContent() {
  const { addedItems, unaddedItems } = useAddedItems()

  return (
    <CategoriesContextProvider>
      <Switch>
        <Route path="/household" exact>
          <Household />
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
