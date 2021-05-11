import { useItems } from "Lists"
import { Item } from "Lists/models"
import { singular } from "pluralize"
import { useEffect, useRef, useState } from "react"

export function useItemInput(addedItems: Item[], unaddedItems: Item[]) {
  const [value, setValue] = useState("")
  const [category, setCategory] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const { addItem: baseAddItem } = useItems()

  const lowerName = singular(value.trim().toLowerCase())
  const previouslyAdded = unaddedItems.find((i) => i.lowerName === lowerName)
  const alreadyAdded = addedItems.find((i) => i.lowerName === lowerName)
  const isValid = Boolean(value) && !alreadyAdded

  useEffect(() => {
    if (previouslyAdded) {
      setCategory(previouslyAdded.category)
    }
  }, [previouslyAdded])

  const addItem = () => {
    baseAddItem(value, category)
    setValue("")
    inputRef.current?.focus()
  }

  const clear = () => {
    setValue("")
    setCategory("")
  }

  return {
    alreadyAdded,
    category,
    inputRef,
    isValid,
    previouslyAdded,
    value,
    addItem,
    clear,
    setCategory,
    setValue,
  }
}
