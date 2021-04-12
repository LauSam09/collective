import { useEffect, useRef, useState } from "react"
import { singular } from "pluralize"

import { useCategories } from "../../CategoriesContext"
import { Item as ItemModel } from "../../models"

import { Item } from "../Common/Item"
import { CategoryModal } from "../CategoryModal"

import classes from "./AddItem.module.css"
import { useItems } from "Lists/useItems"

type AddItemsProps = {
  addedItems: ItemModel[]
  unaddedItems: ItemModel[]
}

export function AddItem(props: AddItemsProps) {
  const { addedItems, unaddedItems } = props

  const [value, setValue] = useState("")
  const [category, setCategory] = useState("")
  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [previouslyAdded, setPreviouslyAdded] = useState<ItemModel>()
  const [alreadyAdded, setAlreadyAdded] = useState<ItemModel>()
  const [isValid, setIsValid] = useState(false)
  const { addItem } = useItems()

  const inputRef = useRef<HTMLInputElement>(null)
  const categories = useCategories()

  useEffect(() => {
    if (previouslyAdded) {
      setCategory(previouslyAdded.category)
    }
  }, [previouslyAdded])

  // TODO not sure an effect is required for this - could just move to function body
  useEffect(() => {
    const lowerName = singular(value.trim().toLowerCase())
    const previouslyAdded = unaddedItems.find((i) => i.lowerName === lowerName)
    setPreviouslyAdded(previouslyAdded)

    if (previouslyAdded) {
      setCategory(previouslyAdded.category)
    }

    setAlreadyAdded(addedItems.find((i) => i.lowerName === lowerName))
  }, [value, unaddedItems, addedItems])

  // TODO similarly here
  useEffect(() => {
    setIsValid(Boolean(value) && !alreadyAdded && !saving)
  }, [value, alreadyAdded, saving])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setSaving(true)
      await addItem(value, category)
      setValue("")
    } finally {
      setSaving(false)
      inputRef.current?.focus()
    }
  }

  const handleClickCancel = () => {
    setValue("")
    setCategory("")
    inputRef.current?.focus()
  }

  return (
    <>
      <form onSubmit={handleSubmit} className={classes.form}>
        <Item
          onClickCategory={() => setIsModalOpen(true)}
          buttonColour={
            categories.find((c) => c.id === category)?.colour ||
            "var(--colour-uncategorised)"
          }
        >
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Item to add..."
            list="items"
          />
        </Item>
        {value.length > 0 ? (
          <datalist id="items">
            {unaddedItems.map((i) => (
              <option key={i.id} value={i.name} />
            ))}
          </datalist>
        ) : null}
        {alreadyAdded && !saving ? (
          <small className={classes.error}>
            {alreadyAdded.name} has already been added
          </small>
        ) : null}
        <div className={classes.actions}>
          <button
            type="button"
            onClick={handleClickCancel}
            disabled={(!Boolean(value) && !category) || saving}
            className={classes.clear}
          >
            Clear
          </button>
          <button type="submit" disabled={!isValid} className={classes.add}>
            {previouslyAdded ? "Add" : "Add New"}
          </button>
        </div>
      </form>
      <CategoryModal
        isOpen={isModalOpen}
        selectedCategoryId={category}
        close={() => setIsModalOpen(false)}
        select={(category) => {
          setCategory(category)
          return Promise.resolve()
        }}
      />
    </>
  )
}
