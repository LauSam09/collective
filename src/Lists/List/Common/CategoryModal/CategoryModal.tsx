import { useCategories } from "Lists/CategoriesContext"
import Modal from "react-modal"

import classes from "./CategoryModal.module.css"

type CategoryModalProps = {
  isOpen: boolean
  selectedCategoryId: string | undefined
  close: () => void
}

export function CategoryModal(props: CategoryModalProps) {
  const { isOpen, selectedCategoryId, close } = props
  const categories = useCategories()

  return (
    <Modal isOpen={isOpen} onRequestClose={close} className={classes.modal}>
      {categories
        .sort((a, b) => a.order - b.order)
        .map((c) => (
          <div
            className={classes.category}
            style={{
              backgroundColor: `${c.colour}40`,
              fontWeight: c.id === selectedCategoryId ? "bold" : "inherit",
            }}
          >
            <span>{c.name}</span>
          </div>
        ))}
    </Modal>
  )
}
