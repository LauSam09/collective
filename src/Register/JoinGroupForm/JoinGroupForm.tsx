import { useUser } from "Authentication"

export function JoinGroupForm() {
  return (
    <div>
      <p>
        Alternatively, ask to be invited quoting: <span>{useUser()?.id}</span>
      </p>
    </div>
  )
}
