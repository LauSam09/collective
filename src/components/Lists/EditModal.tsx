import { faWindowClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Category, Item } from "models"
import React, { useState } from "react"
import Modal from "react-modal"

import classes from "./EditModal.module.css"

type Props = {
  item: Item
  close: () => void
  categories: Category[]
  setCategory: (categoryId: string) => void
}

export default function EditModal(props: Props) {
  const { item, close, categories, setCategory: updateCategory } = props
  const [category, setCategory] = useState(item.category)

  const handleSetCategory = (category: string) => {
    setCategory(category)
    updateCategory(category)
  }

  return (
    <Modal
      isOpen={true}
      onRequestClose={close}
      className={classes.modalContainer}
    >
      <section className={classes.modal}>
        <div className={classes.header}>
          <h3>{item.name}</h3>
          <button onClick={close}>
            <FontAwesomeIcon icon={faWindowClose} />
          </button>
        </div>
        <div className={classes.modalBody}>
          <div>
            <label>Category</label>
            <select
              value={category}
              onChange={(e) =>
                handleSetCategory(e.target.value === "-" ? "" : e.target.value)
              }
            >
              <option value={undefined}> - </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>
    </Modal>
  )
}
