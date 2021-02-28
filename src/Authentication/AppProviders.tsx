import { ReactNode } from "react"
import { AuthProvider, UserProvider } from "."
import { GroupProvider } from "./GroupContext"

type AppProvidersProps = {
  children?: ReactNode
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <UserProvider>
        <GroupProvider>{children}</GroupProvider>
      </UserProvider>
    </AuthProvider>
  )
}
