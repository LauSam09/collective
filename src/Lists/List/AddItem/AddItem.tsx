import { useRef, useState } from "react"
import { singular } from "pluralize"

import { useUserContext } from "Authentication"
import { Item } from "../Common/Item"
import { DatabaseItem, Item as ItemModel } from "../../models"

import classes from "./AddItem.module.css"

type AddItemsProps = {
  addedItems: ItemModel[]
}

export function AddItem(props: AddItemsProps) {
  const { addedItems } = props
  const [value, setValue] = useState("")
  const [saving, setSaving] = useState(false)
  const { getDefaultItemsCollection } = useUserContext()
  const inputRef = useRef<HTMLInputElement>(null)

  const lowerName = singular(value.trim().toLowerCase())
  const alreadyAdded = addedItems.find((i) => i.lowerName === lowerName)
  const isValid = Boolean(value) && !alreadyAdded && !saving

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setSaving(true)
      const itemsCollection = getDefaultItemsCollection()
      const name = value.trim()
      const lowerName = singular(name.toLowerCase())

      const existing = await itemsCollection
        .where("lowerName", "==", lowerName)
        .limit(1)
        .get()

      let databaseItem: DatabaseItem

      if (existing.empty) {
        databaseItem = {
          name,
          lowerName,
          added: true,
          completed: false,
          count: 1,
          notes: "",
          category: "",
        }
        await itemsCollection.add(databaseItem)
      } else {
        await itemsCollection.doc(existing.docs[0].id).update({
          name,
          added: true,
          completed: false,
          count: (existing.docs[0].data().count ?? 0) + 1,
          notes: "",
        })
      }

      setValue("")
    } finally {
      setSaving(false)
      inputRef.current?.focus()
    }
  }

  const handleClickCancel = () => {
    setValue("")
    inputRef.current?.focus()
  }

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <Item>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Item to add..."
        />
      </Item>
      {alreadyAdded && !saving ? (
        <small className={classes.error}>
          {alreadyAdded.name} has already been added
        </small>
      ) : null}
      <div className={classes.actions}>
        <button
          type="button"
          onClick={handleClickCancel}
          disabled={!Boolean(value) || saving}
          className={classes.clear}
        >
          Clear
        </button>
        <button type="submit" disabled={!isValid} className={classes.add}>
          Add
        </button>
      </div>
    </form>
  )
}
