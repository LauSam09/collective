import { useEffect, useState } from "react"

import { Modal } from "Common"
import { Item } from "Lists"
import { Recipe } from "Recipes/models"

import { ReadRecipe } from "./Read"
import { WriteRecipe } from "./Write"

enum Mode {
  "Read",
  "Edit",
}

type RecipeModalProps = {
  isOpen: boolean
  recipe: Recipe
  addedItems: Item[]
  close: () => void
}

export function RecipeModal(props: RecipeModalProps) {
  const { isOpen, recipe: initialRecipe, addedItems, close } = props
  const [mode, setMode] = useState(Mode.Read)
  const [recipe, setRecipe] = useState(initialRecipe)

  useEffect(() => {
    isOpen && setMode(Mode.Read)
  }, [isOpen])

  useEffect(() => {
    setRecipe(initialRecipe)
  }, [initialRecipe])

  function handleSave(recipe: Recipe) {
    setRecipe(recipe)
    setMode(Mode.Read)
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={close}>
      <Modal.Body>
        {mode === Mode.Read ? (
          <ReadRecipe
            recipe={recipe}
            addedItems={addedItems}
            close={close}
            edit={() => setMode(Mode.Edit)}
          />
        ) : (
          <WriteRecipe recipe={recipe} close={close} onSave={handleSave} />
        )}
      </Modal.Body>
    </Modal>
  )
}
