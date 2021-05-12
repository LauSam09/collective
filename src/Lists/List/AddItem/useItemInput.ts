import { useItems } from "Lists"
import { Item } from "Lists/models"
import { singular } from "pluralize"
import { useEffect, useState } from "react"

export function useItemInput(
  addedItems: Item[],
  category: string,
  setCategory: React.Dispatch<React.SetStateAction<string>>,
  unaddedItems: Item[]
) {
  const [value, setValue] = useState("")
  const { addItem: baseAddItem } = useItems()

  const lowerName = singular(value.trim().toLowerCase())
  const previouslyAdded = unaddedItems.find((i) => i.lowerName === lowerName)
  const alreadyAdded = addedItems.find((i) => i.lowerName === lowerName)
  const isValid = Boolean(value) && !alreadyAdded

  useEffect(() => {
    if (previouslyAdded) {
      setCategory(previouslyAdded.category)
    }
  }, [previouslyAdded, setCategory])

  // TODO May want to improve this so that if the category is manually set
  // then it isn't cleared so easily.
  useEffect(() => {
    if (value === "") {
      setCategory("")
    }
  }, [value, setCategory])

  const addItem = () => {
    baseAddItem(value, category)
    setValue("")
  }

  const clear = () => {
    setValue("")
    setCategory("")
  }

  return {
    alreadyAdded,
    category,
    isValid,
    previouslyAdded,
    value,
    addItem,
    clear,
    setCategory,
    setValue,
  }
}
