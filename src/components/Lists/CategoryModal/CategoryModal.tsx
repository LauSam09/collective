import React from "react"
import {
  faShoppingBasket,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { Category } from "models"
import { Button, Modal } from "components"

import classes from "./CategoryModal.module.css"

type CategoryModalProps = {
  isOpen: boolean
  name: string
  categories: Category[]
  selectedCategoryId: string | undefined
  close: () => void
  selectCategory: (category: Category) => Promise<void>
}

export default function CategoryModal(props: CategoryModalProps) {
  const {
    isOpen,
    name,
    close,
    categories,
    selectedCategoryId,
    selectCategory,
  } = props

  return (
    <Modal isOpen={isOpen} onRequestClose={close} closeTimeoutMS={250}>
      {/* TODO move section to modal component */}
      <section className={classes.modal}>
        <div className={classes.header}>
          <h3 title={name}>{name}</h3>
          <Button onClick={close}>
            <FontAwesomeIcon icon={faWindowClose} size="2x" />
          </Button>
        </div>
        <div>
          <ul className={classes.list}>
            {categories.map((category) => (
              <li
                key={category.id}
                onClick={() => selectCategory(category)}
                className={classes.category}
              >
                <span
                  style={{
                    fontWeight:
                      category.id === selectedCategoryId ? "bold" : "inherit",
                  }}
                >
                  {category.name}
                </span>
                <FontAwesomeIcon
                  icon={faShoppingBasket}
                  className={classes.icon}
                  style={{
                    color: category?.colour || "inherit",
                  }}
                  size="lg"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Modal>
  )
}
