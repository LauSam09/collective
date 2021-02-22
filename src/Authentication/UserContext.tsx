import { createContext, ReactNode, useContext } from "react"

import { useAuth } from "."
import User from "./models/user"

type UserContextType = {
  user: User | undefined
  isRegistered: boolean
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
        isRegistered: false,
      }}
      {...props}
    />
  )
}

const useUser = () => useContext(UserContext)
const useIsAuthenticated = () => Boolean(useUser().user)

export { UserContext, UserProvider, useUser, useIsAuthenticated }
