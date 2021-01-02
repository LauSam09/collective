import React, { useContext, useEffect } from "react"
import { Switch, Route } from "react-router-dom"
import { useDispatch } from "react-redux"
import firebase from "firebase/app"

import { ErrorBoundary, Home, Lists, PrivateRoute, Recipes } from "components"
import { ListItem, upsertItem, removeItem as removeItemAction } from "store"
import { AuthenticationContext } from "authentication"

import classes from "./Main.module.css"

export default function Main() {
  const db = firebase.firestore()
  const dispatch = useDispatch()
  const { group } = useContext(AuthenticationContext)

  useEffect(() => {
    if (!group) {
      return
    }

    const unsubscribe = db
      .collection("groups")
      .doc(group?.id)
      .collection("lists")
      .doc(group?.defaultList)
      .collection("items")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          switch (change.type) {
            case "added": {
              const addedItem = change.doc.data()
              const { added, ...rest } = addedItem
              added &&
                dispatch(
                  upsertItem({
                    ...rest,
                    id: change.doc.id,
                    listId: group?.defaultList || "",
                  } as ListItem)
                )
              break
            }

            case "modified": {
              const modifiedItem = change.doc.data()
              const { added, ...rest } = modifiedItem
              added
                ? dispatch(
                    upsertItem({
                      ...rest,
                      id: change.doc.id,
                      listId: group?.defaultList || "",
                    } as ListItem)
                  )
                : dispatch(
                    removeItemAction({
                      id: change.doc.id,
                      listId: group?.defaultList || "",
                    })
                  )
              break
            }
            case "removed":
              dispatch(
                removeItemAction({
                  id: change.doc.id,
                  listId: group?.defaultList || "",
                })
              )
              break
          }
        })
      })

    return () => {
      unsubscribe()
    }
  }, [group, db, dispatch])

  return (
    <main className={classes.content}>
      <ErrorBoundary>
        <Switch>
          <PrivateRoute path="/recipes" exact>
            <Recipes />
          </PrivateRoute>
          <PrivateRoute path="/lists" exact>
            <Lists />
          </PrivateRoute>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </ErrorBoundary>
    </main>
  )
}
