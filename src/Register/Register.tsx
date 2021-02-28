import CreateGroupForm from "./CreateGroupForm"
import { JoinGroupForm } from "./JoinGroupForm"

import classes from "./Register.module.css"

export default function Register() {
  return (
    <article>
      <h1>Welcome to Collective, it looks like you're new here!</h1>
      <section>
        <CreateGroupForm />
        <div className={classes.divider} />
        <JoinGroupForm />
      </section>
    </article>
  )
}
