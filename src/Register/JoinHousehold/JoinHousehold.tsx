import { useHistory, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/functions"

import { useUserContext } from "Authentication"
import { FullPageSpinner } from "Common"
import { db } from "Config"
import { Invitation } from "../models"

import classes from "./JoinHousehold.module.css"

type Params = {
  id: string
}

const functions = firebase.functions()
const acceptInvitation = functions.httpsCallable("acceptInvitation")

export function JoinHousehold() {
  return (
    <article>
      <h2>Join Household</h2>
      <JoinHouseholdContent />
    </article>
  )
}

export function JoinHouseholdContent() {
  const { id } = useParams<Params>()
  const history = useHistory()
  const { refreshUser } = useUserContext()
  const [error, setError] = useState<string>()
  const [working, setWorking] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [invite, setInvite] = useState<Invitation>()

  useEffect(() => {
    db.collection("invites")
      .doc(id)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          setError("Invalid invitation url")
        }

        setInvite(doc.data() as Invitation)
      })
      .catch((err) => setError(err.message))
      .finally(() => {
        setFetching(false)
      })
  }, [id])

  const handleAccept = async () => {
    try {
      setWorking(true)
      await acceptInvitation({ inviteId: id })
      await refreshUser()
      history.push("/")
    } catch (err) {
      setError(err.message)
      setWorking(false)
    }
  }

  if (fetching || working) {
    return <FullPageSpinner />
  }

  if (error || !invite) {
    return <span>There was a problem... {error}</span>
  }

  if (
    firebase.firestore.Timestamp.now().seconds - invite.created.seconds >
    60 * 60
  ) {
    return <span>Invitation expired</span>
  }

  return (
    <div className={classes.accept}>
      <div>
        You've been invited to join {invite.group.name} by {invite.inviter.name}
      </div>
      <div>
        <button onClick={handleAccept}>Accept</button>
      </div>
    </div>
  )
}
