import { useGroup } from "Authentication"

export function Household() {
  return (
    <article>
      <h2>Household</h2>
      <dl>
        <dt>Name</dt>
        <dd>{useGroup()?.name}</dd>
      </dl>
    </article>
  )
}
