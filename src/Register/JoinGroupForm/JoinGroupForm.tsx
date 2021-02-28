import { useUser } from "Authentication"

export function JoinGroupForm() {
  return (
    <div>
      <p>
        Alternatively, if someone else in your household has already signed up,
        then ask them to invite you with this key: <span>{useUser()?.id}</span>
      </p>
    </div>
  )
}
