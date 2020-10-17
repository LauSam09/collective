import React from "react"

import { Category, Item as ItemModel } from "models"

type Props = {
  item: ItemModel
  categories: Category[]
  setCategory: (categoryId: string) => void
  toggleComplete: (complete: boolean) => void
  deleteItem: () => void
  remove: () => void
}

export default function Item(props: Props) {
  const {
    item,
    categories,
    toggleComplete,
    setCategory,
    deleteItem,
    remove,
  } = props

  return (
    <div>
      <input
        type="checkbox"
        checked={item.completed}
        onChange={(e) => toggleComplete(e.target.checked)}
      />
      {item.name}
      <select
        value={item.category}
        onChange={(e) =>
          setCategory(e.target.value === "-" ? "" : e.target.value)
        }
      >
        <option value={undefined}> - </option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <button onClick={() => deleteItem()}>x</button>
      <button onClick={() => remove()}>-</button>
    </div>
  )
}
