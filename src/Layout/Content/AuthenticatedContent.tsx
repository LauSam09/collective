import { useAuth, useUser } from "Authentication"
import Register from "Register"

export default function AuthenticatedContent() {
  const { logout } = useAuth()
  const { user, isRegistered } = useUser()

  return (
    <>
      {isRegistered ? (
        <span>Welcome back, {user?.displayName}</span>
      ) : (
        <Register />
      )}
      <div>
        <button onClick={logout}>Log out</button>
      </div>
    </>
  )
}
