import { useUser, useIsRegistered } from "Authentication"
import Register from "Register"

export default function AuthenticatedContent() {
  const user = useUser()
  const isRegistered = useIsRegistered()

  return isRegistered ? (
    <span>Welcome back, {user?.displayName}</span>
  ) : (
    <Register />
  )
}
