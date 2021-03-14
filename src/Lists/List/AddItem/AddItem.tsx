import { useState } from "react"
import { singular } from "pluralize"

import { useUserContext } from "Authentication"
import { Item } from "../Common/Item"
import { DatabaseItem } from "../../models"

import classes from "./AddItem.module.css"

export function AddItem() {
  // TODO useForm
  const [value, setValue] = useState("")
  const { getDefaultItemsCollection } = useUserContext()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
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
  }

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <Item>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Item to add..."
        />
      </Item>
      <div className={classes.actions}>
        <button
          type="button"
          onClick={() => setValue("")}
          disabled={!Boolean(value)}
          className={classes.clear}
        >
          Clear
        </button>
        <button
          type="submit"
          disabled={!Boolean(value)}
          className={classes.add}
        >
          Add
        </button>
      </div>
    </form>
  )
}
