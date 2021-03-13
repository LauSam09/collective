import { useState } from "react"

import { useGroup } from "Authentication"
import { db } from "Config"
import { Item } from "../Common/Item"
import { DatabaseItem } from "../../models"

import classes from "./AddItem.module.css"

export function AddItem() {
  // TODO useForm
  const [value, setValue] = useState("")
  const { defaultList, id } = useGroup() || {}

  if (!defaultList || !id) {
    throw new Error("Group not defined for user.")
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // TODO add logic to retrieve existing item
    const item: DatabaseItem = {
      added: true,
      completed: false,
      category: "",
      name: value,
      lowerName: value.toLowerCase(), // TODO use pluralize library
      notes: "",
      count: 1,
    }
    await db
      .collection("groups")
      .doc(id)
      .collection("lists")
      .doc(defaultList)
      .collection("items")
      .add(item)
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
