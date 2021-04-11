import { faCheck, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Modal } from "Common"
import { Recipe } from "Recipes/models"

import classes from "./RecipeModal.module.css"

type IngredientProps = {
  name: string
  added: boolean
  toggle: () => void
}

function Ingredient(props: IngredientProps) {
  const { added, name } = props

  return (
    <div>
      {name}
      <button>
        <FontAwesomeIcon icon={added ? faCheck : faPlus} />
      </button>
    </div>
  )
}

type RecipeModalProps = {
  isOpen: boolean
  recipe: Recipe
  close: () => void
}

export function RecipeModal(props: RecipeModalProps) {
  const { isOpen, recipe, close } = props

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
          recipe.ingredients.map((i) => (
            <Ingredient name={i} added={false} toggle={() => null} />
          ))
        )}
      </div>
    </Modal>
  )
}
