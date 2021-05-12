import React, { forwardRef, useImperativeHandle, useRef, useState } from "react"

import { useCategories } from "../../CategoriesContext"
import { Item as ItemModel } from "../../models"

import { Item } from "../Common/Item"
import { CategoryModal } from "../CategoryModal"
import { useItemInput } from "./useItemInput"

import classes from "./AddItem.module.css"

export interface AddItemsProps {
  addedItems: ItemModel[]
  category: string
  setCategory: React.Dispatch<React.SetStateAction<string>>
  unaddedItems: ItemModel[]
}

export const AddItem = forwardRef<HTMLInputElement, AddItemsProps>(
  (props, ref) => {
    const { addedItems, category, setCategory, unaddedItems } = props
    const {
      alreadyAdded,
      isValid,
      previouslyAdded,
      value,
      addItem,
      clear,
      setValue,
    } = useItemInput(addedItems, category, setCategory, unaddedItems)
    const inputRef = useRef<HTMLInputElement>(null)
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const categories = useCategories()

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      addItem()
      inputRef.current?.focus()
    }

    const handleClickCancel = () => clear()

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
              {previouslyAdded || value === "" ? "Add" : "Add (New)"}
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
)
