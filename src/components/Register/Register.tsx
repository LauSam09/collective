import React, { useContext, useState } from "react"
import { AuthenticationContext } from "authentication"

export default function Register() {
  const { register } = useContext(AuthenticationContext)
  const [name, setName] = useState("")
  const valid = Boolean(name)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!valid) {
      return
    }

    await register({ name })
  }

  return (
    <>
      <h2>Welcome to Collective!</h2>
      <p>Create a group to share with</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <input type="submit" disabled={!name} />
      </form>
    </>
  )
}
