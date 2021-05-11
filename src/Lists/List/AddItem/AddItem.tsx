import { useEffect, useRef, useState } from "react"
import { singular } from "pluralize"

import { useCategories } from "../../CategoriesContext"
import { Item as ItemModel } from "../../models"

import { Item } from "../Common/Item"
import { CategoryModal } from "../CategoryModal"
import { useItems } from "Lists/useItems"

import classes from "./AddItem.module.css"

type AddItemsProps = {
  addedItems: ItemModel[]
  unaddedItems: ItemModel[]
}

export function AddItem(props: AddItemsProps) {
  const { addedItems, unaddedItems } = props

  const [value, setValue] = useState("")
  const [category, setCategory] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { addItem } = useItems()
  const categories = useCategories()

  const lowerName = singular(value.trim().toLowerCase())
  const previouslyAdded = unaddedItems.find((i) => i.lowerName === lowerName)
  const alreadyAdded = addedItems.find((i) => i.lowerName === lowerName)
  const isValid = Boolean(value) && !alreadyAdded

  useEffect(() => {
    if (previouslyAdded) {
      setCategory(previouslyAdded.category)
    }
  }, [previouslyAdded])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    addItem(value, category)
    setValue("")
    inputRef.current?.focus()
  }

  const handleClickCancel = () => {
    setValue("")
    setCategory("")
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
        {alreadyAdded ? (
          <small className={classes.error}>
            {alreadyAdded.name} has already been added
          </small>
        ) : null}
        <div className={classes.actions}>
          <button
            type="button"
            onClick={handleClickCancel}
            disabled={!Boolean(value) && !category}
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
