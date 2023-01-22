import { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuthentication } from "../hooks/useAuthentication"

type ProtectedProps = {
  children: ReactNode
}

export const Protected = ({ children }: ProtectedProps) => {
  const { state } = useAuthentication()
  const location = useLocation()

  if (state === "Unauthenticated") {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
