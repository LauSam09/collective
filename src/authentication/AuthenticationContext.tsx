import React, { createContext } from "react"

import { Group, UserState } from "../models"

import useAuthentication from "./useAuthentication"
import useRegistration from "./useRegistration"

type AuthenticationContextType = {
  loaded: boolean
  authenticated: boolean
  initialised: boolean
  userState: UserState | undefined
  login: () => Promise<void>
  logout: () => Promise<void>
  register: (group: Group) => Promise<void>
  group?: Group
}

export const AuthenticationContext = createContext<AuthenticationContextType>({
  loaded: false,
  authenticated: false,
  initialised: false,
  userState: undefined,
  login: async () => {},
  logout: async () => {},
  register: async (group: Group) => {},
})

export const AuthenticationContextProvider = ({
  children,
}: {
  children: any
}) => {
  const { initialised, authenticated, login, logout } = useAuthentication()
  const { loaded, userState, register, group } = useRegistration({
    authenticated,
  })

  const values = {
    loaded,
    initialised,
    authenticated,
    userState,
    login,
    logout,
    register,
    group,
  }
  return (
    <AuthenticationContext.Provider value={values}>
      {children}
    </AuthenticationContext.Provider>
  )
}
