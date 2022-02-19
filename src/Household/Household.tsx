import { useState } from "react"
import firebase from "firebase/app"
import { faLink, faUserPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cx from "classnames/bind"
import "firebase/functions"

import { useGroup } from "Authentication"
import { Spinner } from "Common"

import classes from "./Household.module.css"

const classnames = cx.bind(classes)

const functions = firebase.functions()
const createInvitation = functions.httpsCallable("createInvitation")

export const Household = () => {
  const group = useGroup()

  if (!group) {
    throw new Error("Should not use household if group is not defined.")
  }

  return (
    <article>
      <h2>Household</h2>
      <dl>
        <dt>Name</dt>
        <dd>{useGroup()?.name}</dd>
      </dl>
      <h4>Invite Member</h4>
      <InviteMember />
    </article>
  )
}

const InviteMember = () => {
  const group = useGroup()
  const [working, setWorking] = useState(false)
  const [error, setError] = useState<string>()
  const [url, setUrl] = useState<string>()
  const [copied, setCopied] = useState(false)

  if (!group) {
    throw new Error("Should not use household if group is not defined.")
  }

  const handleClick = async () => {
    try {
      setWorking(true)
      const { data: inviteId } = await createInvitation({ groupId: group.id })
      setUrl(`${window.location.origin}/join/${inviteId}`)
    } catch (err) {
      console.error(err)
      setError(err as string)
    } finally {
      setWorking(false)
    }
  }

  const handleClickCopy = () => {
    if (!url) {
      return
    }
    try {
      navigator.clipboard.writeText(url)
      setCopied(true)
    } catch (err) {
      console.error(err)
      setError(err as string)
    }
  }

  if (working) {
    return (
      <>
        <span>Creating invitation...</span>
        <Spinner className={classes.spinner} />{" "}
      </>
    )
  }

  if (error) {
    return <span>It looks like something went wrong... {error}</span>
  }

  if (url) {
    return (
      <>
        <p>
          Click the icon below to copy a link to your clipboard that is valid
          for one hour.
        </p>
        <div className={classnames(classes.link, { success: copied })}>
          <button onClick={handleClickCopy} className={classes.button}>
            <FontAwesomeIcon icon={faLink} size="2x" />
          </button>
          {copied ? <small>copied to clipboard</small> : null}
        </div>
      </>
    )
  }

  return (
    <button onClick={handleClick} className={classnames(classes.button)}>
      <FontAwesomeIcon icon={faUserPlus} size="2x" />
    </button>
  )
}
