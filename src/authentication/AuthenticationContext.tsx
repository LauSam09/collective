import React, { createContext } from 'react'
import useAuthentication from './useAuthentication'

export const AuthenticationContext = createContext({
  authenticated: false,
  initialised: false,
  login: async () => {},
  logout: async () => {}
})

export const AuthenticationContextProvider = ({ children }: { children: any }) => {
  const { initialised, authenticated, login, logout } = useAuthentication()
  const values = {
    initialised,
    authenticated,
    login,
    logout
  }
  return <AuthenticationContext.Provider value={values}>{children}</AuthenticationContext.Provider>
}
