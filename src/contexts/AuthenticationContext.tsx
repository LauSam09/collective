import { createContext, ReactNode, useState } from "react"

type AuthenticationState = "Loading" | "Authenticated" | "Unauthenticated"

type Authentication = {
  state: AuthenticationState
}

export const AuthenticationContext = createContext<Authentication>({
  state: "Loading",
})

type AuthenticationContextProviderProps = {
  children: ReactNode
}

export const AuthenticationProvider = (
  props: AuthenticationContextProviderProps
) => {
  const { children } = props
  const [state] = useState<AuthenticationState>("Loading")

  return (
    <AuthenticationContext.Provider value={{ state }}>
      {children}
    </AuthenticationContext.Provider>
  )
}
