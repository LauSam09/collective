import React, { FormEvent, useState } from "react"

import useList from "./useList"

export default function Lists() {
  const { items, addItem, deleteItem } = useList()
  const [name, setName] = useState("")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    await addItem({ name, id: "" })
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
              {item.name}
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
