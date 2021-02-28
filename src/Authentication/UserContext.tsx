import { createContext, ReactNode, useContext } from "react"

import { useAuth } from "."
import { User } from "./models"

type UserContextType = {
  user: User | undefined
}

const UserContext = createContext<Partial<UserContextType>>({})

type UserProviderProps = {
  children?: ReactNode
}

function UserProvider(props: UserProviderProps) {
  const user = useAuth().user

  return (
    <UserContext.Provider
      value={{
        user,
      }}
      {...props}
    />
  )
}

const useUser = () => useContext(UserContext).user
const useIsAuthenticated = () => Boolean(useUser())

export { UserContext, UserProvider, useUser, useIsAuthenticated }
