import { useAuth } from "Authentication"

import GoogleLoginButton from "./GoogleLoginButton"
import Features from "./Features"

import classes from "./AnonymousSplash.module.css"

export default function AnonymousSplash() {
  const { login } = useAuth()

  return (
    <article>
      <h1>Welcome to Collective</h1>
      <h4>The app for managing and sharing shopping &amp; recipes</h4>

      <div className={classes.login}>
        <GoogleLoginButton onClick={login} />
      </div>

      <section>
        <Features />
      </section>
    </article>
  )
}
