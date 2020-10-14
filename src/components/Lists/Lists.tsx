import React, { FormEvent, useState } from "react"

import useList from "./useList"

import classes from "./Lists.module.css"

export default function Lists() {
  const {
    items,
    categories,
    addItem,
    deleteItem,
    removeItem,
    removeAll,
    setCompletionStatus,
    setCategory,
  } = useList()
  const [name, setName] = useState("")

  const valid =
    name &&
    items.filter(
      (item) => item.name.trim().toLowerCase() === name.trim().toLowerCase()
    ).length === 0

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    await addItem({ name, id: "", completed: false })
    setName("")
  }

  return (
    <div className={classes.wrapper}>
      <form onSubmit={handleSubmit} className={classes.addForm}>
        <input
          value={name}
          className={classes.input}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" className={classes.submit} disabled={!valid}>
          Add
        </button>
      </form>
      <sub>
        <button onClick={removeAll}>Clear</button>
      </sub>
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
