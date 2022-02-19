import { Redirect, Route, Switch } from "react-router-dom"

import { useIsRegistered } from "Authentication"
import { JoinHousehold, Register } from "Register"
import { Household } from "Household"
import { RegisteredSplash } from "Splash"
import { CategoriesContextProvider, List, useItemSubscription } from "Lists"
import { Recipes, useRecipeSubscription } from "Recipes"
import { Tasks } from "Tasks"

const RegisteredContent = () => {
  const { addedItems, allItems } = useItemSubscription()
  const { recipes } = useRecipeSubscription()

  const plannedDays = new Set()
  recipes.forEach((r) => r.days?.forEach((d) => plannedDays.add(d)))

  return (
    <CategoriesContextProvider>
      <Switch>
        <Route path="/household" exact>
          <Household />
        </Route>
        <Route path="/recipes" exact>
          <Recipes addedItems={addedItems} recipes={recipes} />
        </Route>
        <Route path="/shopping" exact>
          <List addedItems={addedItems} allItems={allItems} />
        </Route>
        <Route path="/tasks" exact>
          <Tasks />
        </Route>
        <Route path="/" exact>
          <RegisteredSplash
            itemCount={addedItems.length}
            planCount={plannedDays.size}
          />
        </Route>
        <Redirect to="/" />
      </Switch>
    </CategoriesContextProvider>
  )
}

const UnregisteredContent = () => (
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

export const AuthenticatedContent = () => {
  return useIsRegistered() ? <RegisteredContent /> : <UnregisteredContent />
}
