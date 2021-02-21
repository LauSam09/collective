import { useIsAuthenticated } from "../../Authentication"
import classes from "./Content.module.css"

export default function Content() {
  return (
    <div className={classes.content}>
      {useIsAuthenticated() ? "Authenticated" : "Unauthenticated"}
    </div>
  )
}
