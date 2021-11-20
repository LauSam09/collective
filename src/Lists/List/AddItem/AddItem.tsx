import React, {
  createRef,
  FormEvent,
  forwardRef,
  useMemo,
  useState,
} from "react"
import AsyncSelect from "react-select/async-creatable"

import { useCategories } from "../../CategoriesContext"
import { ItemModel } from "../../models"

import { Item } from "../Common/Item"
import { CategoryModal } from "../CategoryModal"
import { useItemInput } from "./useItemInput"
import { LoadOptionsCallback, SelectRef } from "./types"

import classes from "./AddItem.module.css"

export interface AddItemsProps {
  addedItems: ItemModel[]
  category: string
  unaddedItems: ItemModel[]
  setCategory: React.Dispatch<React.SetStateAction<string>>
}

export const AddItem = forwardRef<HTMLInputElement, AddItemsProps>(
  (props, ref) => {
    const { addedItems, category, unaddedItems, setCategory } = props
    const { alreadyAdded, isValid, previouslyAdded, value, addItem, setValue } =
      useItemInput(addedItems, category, setCategory, unaddedItems)
    const inputRef = createRef<SelectRef>()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const categories = useCategories()

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      addItem()
      inputRef.current?.focus()
    }

    const options = useMemo(
      () =>
        unaddedItems
          .map((i) => ({ value: i.name, label: i.name }))
          .sort((a, b) =>
            a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1
          ),
      [unaddedItems]
    )

    const handleLoadOptions = (
      inputValue: string,
      callback: LoadOptionsCallback
    ) =>
      callback(
        options.filter((o) =>
          o.label.toLowerCase().includes(inputValue.toLowerCase())
        )
      )

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
            <AsyncSelect
              value={{ label: value, value }}
              onChange={(newValue) => setValue(newValue?.value ?? "")}
              loadOptions={handleLoadOptions}
              noOptionsMessage={() => null}
              isClearable
              ref={inputRef}
              blurInputOnSelect={false}
            />
          </Item>
          {alreadyAdded ? (
            <small className={classes.error}>
              {alreadyAdded.name} has already been added
            </small>
          ) : null}
          <div className={classes.actions}>
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
