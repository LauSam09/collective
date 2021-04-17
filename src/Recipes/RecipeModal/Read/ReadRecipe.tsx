import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { singular } from "pluralize"

import { Modal } from "Common"
import { Item, useItems } from "Lists"
import { Recipe } from "Recipes/models"

import { Ingredient } from "./Ingredient"
import { Days } from "./Days"

type IngredientViewModel = {
  name: string
  added: boolean
  toggle: () => Promise<void>
}

type ReadRecipeProps = {
  recipe: Recipe
  addedItems: Item[]
  close: () => void
  edit: () => void
}

export function ReadRecipe(props: ReadRecipeProps) {
  const { recipe, addedItems, close, edit } = props
  const { addItem, removeItem } = useItems()

  const sanitisedIngredients = (recipe.ingredients ?? []).map((i) => ({
    sanitisedName: singular(i.toLowerCase()),
    name: i,
  }))
  const viewIngredients: IngredientViewModel[] = sanitisedIngredients.map(
    (i) => {
      const addedItem = addedItems.find(
        (ai) => ai.lowerName === i.sanitisedName
      )
      const added = !!addedItem
      return {
        name: i.name,
        added,
        toggle: addedItem
          ? () => removeItem(addedItem.id)
          : () => addItem(i.name),
      }
    }
  )

  return (
    <>
      <Modal.Header>
        {recipe.name}
        <button onClick={edit} style={{ float: "right" }}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
      </Modal.Header>
      <Days id={recipe.id} recipeDays={recipe.days} />
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
      <button onClick={close}>Close</button>
    </>
  )
}
