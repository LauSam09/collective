import { useIsAuthenticated } from "Authentication"

import AnonymousContent from "./AnonymousContent"
import AuthenticatedContent from "./AuthenticatedContent"
import classes from "./Content.module.css"

export default function Content() {
  return (
    <div className={classes.content}>
      {useIsAuthenticated() ? <AuthenticatedContent /> : <AnonymousContent />}
    </div>
  )
}
