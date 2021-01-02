import React, { PropsWithChildren, useContext } from "react"
import { Route, Redirect, RouteProps } from "react-router-dom"

import { AuthenticationContext } from "authentication"

type PrivateRouteProps = RouteProps & PropsWithChildren<unknown>

export default function PrivateRoute(props: PrivateRouteProps) {
  const { children, ...rest } = props
  const { authenticated } = useContext(AuthenticationContext)

  return authenticated ? (
    <Route {...rest}>{children}</Route>
  ) : (
    <Redirect to={{ pathname: "/" }} />
  )
}
