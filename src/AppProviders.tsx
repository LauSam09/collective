import { ReactNode } from "react"
import { AuthProvider, GroupProvider, UserProvider } from "Authentication"

type AppProvidersProps = {
  children?: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <UserProvider>
        <GroupProvider>{children}</GroupProvider>
      </UserProvider>
    </AuthProvider>
  )
}
