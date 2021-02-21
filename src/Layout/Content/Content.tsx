import { useAuth, useIsAuthenticated, useUser } from "../../Authentication"
import classes from "./Content.module.css"

export default function Content() {
  const { login, logout } = useAuth()
  const user = useUser()

  return (
    <div className={classes.content}>
      {useIsAuthenticated() ? (
        <>
          <span>Welcome back, {user?.displayName}</span>
          <div>
            <button onClick={logout}>Log out</button>
          </div>
        </>
      ) : (
        <button onClick={login}>Log in</button>
      )}
    </div>
  )
}
