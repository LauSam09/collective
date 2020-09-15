import React, { createContext } from 'react'

import { UserState } from '../models'
import useAuthentication from './useAuthentication'

type AuthenticationContextType = {
  authenticated: boolean;
  initialised: boolean;
  userState: UserState | undefined;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthenticationContext = createContext<AuthenticationContextType>({
  authenticated: false,
  initialised: false,
  userState: undefined,
  login: async () => {},
  logout: async () => {}
})

export const AuthenticationContextProvider = ({ children }: { children: any }) => {
  const { initialised, authenticated, userState, login, logout } = useAuthentication()
  const values = {
    initialised,
    authenticated,
    userState,
    login,
    logout
  }
  return <AuthenticationContext.Provider value={values}>{children}</AuthenticationContext.Provider>
}
