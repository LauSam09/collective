import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import AsyncSelect from "react-select/async"

import { useCategories } from "../../CategoriesContext"
import { ItemModel } from "../../models"

import { Item } from "../Common/Item"
import { CategoryModal } from "../CategoryModal"
import { useItemInput } from "./useItemInput"

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
    const inputRef = useRef<HTMLInputElement>(null)
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const categories = useCategories()

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
              onChange={(value) => setValue((value as any)?.value ?? "")}
              loadOptions={(inputValue, callback) =>
                callback(
                  options.filter((o) =>
                    o.label.toLowerCase().includes(inputValue.toLowerCase())
                  )
                )
              }
              noOptionsMessage={() => null}
              isClearable
            />
          </Item>
          {alreadyAdded ? (
            <small className={classes.error}>
              {alreadyAdded.name} has already been added
            </small>
          ) : null}
          <div className={classes.actions}>
            {/* <button
              type="button"
              onClick={handleClickCancel}
              disabled={!Boolean(value) && !category}
              className={classes.clear}
            >
              Clear
            </button> */}
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
