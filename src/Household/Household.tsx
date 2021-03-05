import { useState } from "react"
import { faUserPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cx from "classnames/bind"

import { useGroup } from "Authentication"

import classes from "./Household.module.css"

const classnames = cx.bind(classes)

export function Household() {
  const group = useGroup()
  const [copied, setCopied] = useState(false)

  if (!group) {
    throw new Error("Should not use household if group is not defined.")
  }

  const url = `${window.location.origin}/join/${group.id}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
  }

  return (
    <article>
      <h2>Household</h2>
      <dl>
        <dt>Name</dt>
        <dd>{useGroup()?.name}</dd>
      </dl>
      <h4>Invite someone to join by sharing this url (click to copy)</h4>
      <button
        onClick={copyToClipboard}
        className={classnames(classes.inviteButton, { copied: copied })}
      >
        <FontAwesomeIcon icon={faUserPlus} size="2x" />
      </button>
    </article>
  )
}
