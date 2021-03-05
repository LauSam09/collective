import CreateGroupForm from "./CreateGroupForm"

import classes from "./Register.module.css"

export default function Register() {
  return (
    <article>
      <h1>Welcome to Collective, it looks like you're new here!</h1>
      <section>
        <CreateGroupForm />
        <div className={classes.divider} />
        <span>
          Alternatively, ask to be invited to a household. They'll send you a
          link which will allow you to join.
        </span>
      </section>
    </article>
  )
}
