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

const useUser = () => useContext(UserContext).user
const useIsAuthenticated = () => Boolean(useUser())
const useIsRegistered = () => useContext(UserContext).isRegistered

export {
  UserContext,
  UserProvider,
  useUser,
  useIsAuthenticated,
  useIsRegistered,
}
