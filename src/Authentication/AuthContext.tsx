import { createContext, ReactNode, useContext } from "react"

type AuthContextType = {
  login: () => void
  logout: () => void
  register: () => void
  user?: { firstName: string }
}

const AuthContext = createContext<Partial<AuthContextType>>({})

type AuthProviderProps = {
  children?: ReactNode
}

function AuthProvider(props: AuthProviderProps) {
  function login() {}

  function logout() {}

  function register() {}

  return <AuthContext.Provider value={{ login, logout, register }} {...props} />
}

const useAuth = () => useContext(AuthContext)

export { AuthProvider, useAuth }
