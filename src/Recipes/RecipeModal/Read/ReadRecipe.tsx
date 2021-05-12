import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { singular } from "pluralize"

import { Button, FormGroup, Modal } from "Common"
import { Item, useItems } from "Lists"
import { Recipe } from "Recipes/models"

import { Ingredient } from "./Ingredient"
import { Days } from "./Days"

import classes from "./ReadRecipe.module.css"

interface IngredientViewModel {
  name: string
  added: boolean
  toggle: () => Promise<void>
}

interface ReadRecipeProps {
  recipe: Recipe
  addedItems: Item[]
  close: () => void
  edit: () => void
}

export const ReadRecipe = (props: ReadRecipeProps) => {
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
      <div className={classes.headerContainer}>
        <Modal.Header>
          <h4>{recipe.name}</h4>
        </Modal.Header>
        <Button title="Edit" onClick={edit} className={classes.editButton}>
          <FontAwesomeIcon icon={faEdit} size="lg" />
        </Button>
      </div>
      <Days id={recipe.id} recipeDays={recipe.days ?? []} />
      {recipe.recipeUrl ? (
        <FormGroup>
          <label>Recipe Url</label>
          <a
            href={recipe.recipeUrl}
            target="_blank"
            rel="noreferrer"
            title={recipe.recipeUrl}
            className={classes.recipeUrl}
          >
            {recipe.recipeUrl}
          </a>
        </FormGroup>
      ) : null}
      <FormGroup>
        <label>Ingredients</label>
        {recipe.ingredients === undefined || recipe.ingredients.length === 0 ? (
          <span>No ingredients added</span>
        ) : (
          viewIngredients.map((i, index) => <Ingredient key={index} {...i} />)
        )}
      </FormGroup>
      <div className={classes.actions}>
        <Button onClick={close} title="Close">
          Close
        </Button>
      </div>
    </>
  )
}
