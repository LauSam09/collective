import { useEffect, useState } from "react"

import { Modal } from "Common"
import { ItemModel } from "Lists"
import { RecipeModel } from "Recipes"

import { ReadRecipe } from "./Read"
import { WriteRecipe } from "./Write"

enum Mode {
  "Read",
  "Write",
}

interface RecipeModalProps {
  isOpen: boolean
  recipe: RecipeModel
  addedItems: ItemModel[]
  close: () => void
}

export const RecipeModal = (props: RecipeModalProps) => {
  const { isOpen, recipe: initialRecipe, addedItems, close } = props
  const [mode, setMode] = useState(Mode.Read)
  const [recipe, setRecipe] = useState(initialRecipe)

  useEffect(() => {
    isOpen && (recipe.id ? setMode(Mode.Read) : setMode(Mode.Write))
  }, [isOpen, recipe])

  useEffect(() => {
    setRecipe(initialRecipe)
  }, [initialRecipe])

  function handleSave(recipe: RecipeModel) {
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
            edit={() => setMode(Mode.Write)}
          />
        ) : (
          <WriteRecipe recipe={recipe} close={close} onSave={handleSave} />
        )}
      </Modal.Body>
    </Modal>
  )
}
