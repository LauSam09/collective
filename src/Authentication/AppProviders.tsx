import { ReactNode } from "react"
import { AuthProvider, UserProvider } from "."

type AppProvidersProps = {
  children?: ReactNode
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <UserProvider>{children}</UserProvider>
    </AuthProvider>
  )
}
