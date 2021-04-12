import { singular } from "pluralize"

import { Modal } from "Common"
import { Item, useItems } from "Lists"
import { Recipe } from "Recipes/models"

import { Ingredient } from "./Ingredient"

import classes from "./RecipeModal.module.css"

type IngredientViewModel = {
  name: string
  added: boolean
  toggle: () => Promise<void>
}

type RecipeModalProps = {
  isOpen: boolean
  recipe: Recipe
  addedItems: Item[]
  close: () => void
}

export function RecipeModal(props: RecipeModalProps) {
  const { isOpen, recipe, addedItems, close } = props
  const { addItem, removeItem } = useItems()

  const sanitisedIngredients = (recipe.ingredients ?? []).map((i) =>
    singular(i.toLowerCase())
  )
  const viewIngredients: IngredientViewModel[] = sanitisedIngredients.map(
    (name) => {
      const addedItem = addedItems.find((ai) => ai.lowerName === name)
      const added = !!addedItem
      return {
        name,
        added,
        // TODO addItem will remove the category at the moment. Need to modify addItem.
        toggle: addedItem
          ? () => removeItem(addedItem.id)
          : () => addItem(name),
      }
    }
  )

  return (
    <Modal isOpen={isOpen} onRequestClose={close}>
      {/* TODO factor out Modal.Body, Modal.Header, etc. */}
      <div className={classes.modalBody}>
        <h4>{recipe.name}</h4>
        {recipe.recipeUrl ? (
          <>
            <label>Recipe Url</label>
            <a href={recipe.recipeUrl} target="_blank" rel="noreferrer">
              {recipe.recipeUrl}
            </a>
          </>
        ) : null}
        <label>Ingredients</label>
        {recipe.ingredients === undefined || recipe.ingredients.length === 0 ? (
          <span>No ingredients added</span>
        ) : (
          viewIngredients.map((i) => <Ingredient {...i} />)
        )}
      </div>
    </Modal>
  )
}
