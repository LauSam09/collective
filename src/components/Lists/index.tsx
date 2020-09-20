import React from "react"

import useList from "./useList"

export default function Lists() {
  const { items } = useList()

  return (
    <div>
      <h2>Your items</h2>
      {items.length ? (
        <ul>
          {items.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      ) : (
        <p>No items added yet</p>
      )}
    </div>
  )
}
