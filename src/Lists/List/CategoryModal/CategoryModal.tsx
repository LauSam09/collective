import { useCategories } from "Lists/CategoriesContext"

import { Modal } from "Common"

import classes from "./CategoryModal.module.css"

interface CategoryModalProps {
  isOpen: boolean
  selectedCategoryId: string | undefined
  close: () => void
  select: (categoryId: string) => Promise<void>
}

export const CategoryModal = (props: CategoryModalProps) => {
  const { isOpen, selectedCategoryId, close, select } = props
  const categories = useCategories()

  const handleClick = async (category: string) => {
    if (category === selectedCategoryId) {
      close()
    }

    try {
      await select(category)
      close()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={close}>
      {categories
        .sort((a, b) => a.order - b.order)
        .map((c) => (
          <div
            key={c.name}
            onClick={() => handleClick(c.id || "")}
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
