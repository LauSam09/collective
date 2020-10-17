import React, { FormEvent, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"

import useList from "./useList"

import classes from "./Lists.module.css"
import Item from "./Item"

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
      <div className={classes.clear}>
        <button onClick={removeAll} title="Clear completed">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
      {items.length ? (
        <ul className={classes.list}>
          {items.map((item) => (
            <li key={item.id}>
              <Item
                item={item}
                categories={categories}
                setCategory={(categoryId) => setCategory(item.id, categoryId)}
                toggleComplete={(status) =>
                  setCompletionStatus(item.id, status)
                }
                deleteItem={() => deleteItem(item.id)}
                remove={() => removeItem(item.id)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p>No items added yet</p>
      )}
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
    </div>
  )
}
