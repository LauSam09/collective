import { useParams } from "react-router-dom"
import { useState } from "react"
import firebase from "firebase/app"
import "firebase/functions"

import { useUserContext } from "Authentication"
import { Spinner } from "Common"

import classes from "./JoinHousehold.module.css"

type Params = {
  id: string
}

const functions = firebase.functions()
const joinHousehold = functions.httpsCallable("joinHousehold")

export function JoinHousehold() {
  const { id } = useParams<Params>()
  const { refreshUser } = useUserContext()
  const [error, setError] = useState<string>()
  const [working, setWorking] = useState(false)

  const handleClick = async () => {
    try {
      setWorking(true)
      await joinHousehold({ groupId: id })
      await refreshUser()
    } catch (err) {
      setError(err.message)
      setWorking(false)
    }
  }

  return (
    <article>
      {error ? (
        <span style={{ color: "var(--colour-error)" }}>
          It looks like something went wrong: {error}
        </span>
      ) : (
        <span>You've been invited to join {id}</span>
      )}

      <div className={classes.accept}>
        {working ? (
          <Spinner className={classes.spinner} />
        ) : (
          <button disabled={!!error} onClick={handleClick}>
            Accept
          </button>
        )}
      </div>
    </article>
  )
}
