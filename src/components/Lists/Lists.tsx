import { Category } from "models"
import React, { FormEvent, useState } from "react"

import useList from "./useList"

export default function Lists() {
  const {
    items,
    categories,
    addItem,
    deleteItem,
    setCompletionStatus,
  } = useList()
  const [name, setName] = useState("")
  const categoryMap: { [key: string]: Category } = categories.reduce(
    (obj, cur, i) => {
      return { ...obj, [cur.id]: cur }
    },
    {}
  )

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    await addItem({ name, id: "", completed: false })
    setName("")
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit" disabled={!name}>
          Add
        </button>
      </form>
      <h2>Your items</h2>
      {items.length ? (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <input
                type="checkbox"
                checked={item.completed}
                onChange={(e) => setCompletionStatus(item.id, e.target.checked)}
              />
              {item.name}
              {" (" +
                (item.category
                  ? categoryMap[item.category]?.name || "..."
                  : "uncategorised") +
                ") "}
              <button onClick={() => deleteItem(item.id)}>x</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No items added yet</p>
      )}
    </div>
  )
}
