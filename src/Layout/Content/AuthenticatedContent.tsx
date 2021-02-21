import { useAuth, useUser } from "Authentication"

export default function AuthenticatedContent() {
  const { logout } = useAuth()
  const user = useUser()

  return (
    <>
      <span>Welcome back, {user?.displayName}</span>
      <div>
        <button onClick={logout}>Log out</button>
      </div>
    </>
  )
}
