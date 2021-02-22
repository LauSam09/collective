import CreateGroupForm from "./CreateGroupForm"

export default function Register() {
  return (
    <article>
      <h1>Welcome to Collective, it looks like you're new here!</h1>
      <p>
        If you're the first in your household to sign up, then create a new
        household below.
      </p>
      <section>
        <CreateGroupForm />
      </section>
    </article>
  )
}
