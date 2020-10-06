import React, { FormEvent, useState } from "react"

import useList from "./useList"

export default function Lists() {
  const {
    items,
    categories,
    addItem,
    deleteItem,
    removeItem,
    setCompletionStatus,
    setCategory,
  } = useList()
  const [name, setName] = useState("")

  const valid =
    name &&
    items.filter(
      (item) => item.name.toLowerCase() === name.trim().toLowerCase()
    ).length === 0

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
        <button type="submit" disabled={!valid}>
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
              <select
                value={item.category}
                onChange={(e) =>
                  setCategory(
                    item.id,
                    e.target.value === "-" ? "" : e.target.value
                  )
                }
              >
                <option value={undefined}> - </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button onClick={() => deleteItem(item.id)}>x</button>
              <button onClick={() => removeItem(item.id)}>-</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No items added yet</p>
      )}
    </div>
  )
}
