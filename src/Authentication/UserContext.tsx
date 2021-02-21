import { createContext, ReactNode, useContext } from "react"

import { useAuth } from "."

type UserContextType = { firstName: string } | undefined

const UserContext = createContext<UserContextType>(undefined)

type UserProviderProps = {
  children?: ReactNode
}

function UserProvider(props: UserProviderProps) {
  return <UserContext.Provider value={useAuth().user} {...props} />
}

const useUser = () => useContext(UserContext)
const useIsAuthenticated = () => Boolean(useUser())

export { UserProvider, useUser, useIsAuthenticated }
