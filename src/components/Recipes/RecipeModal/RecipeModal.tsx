import React, { FormEvent, useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faWindowClose } from "@fortawesome/free-solid-svg-icons"

import { Button, Modal } from "components"
import { Recipe } from "models"

import classes from "./RecipeModal.module.css"

type RecipeModalProps = {
  open: boolean
  recipes: Recipe[]
  close: () => void
  recipe?: Recipe
  addRecipe: (recipe: Recipe) => Promise<void>
  updateRecipe: (recipe: Recipe) => Promise<void>
}

export default function RecipeModal(props: RecipeModalProps) {
  const { open, recipe, recipes, addRecipe, updateRecipe, close } = props

  const [name, setName] = useState(recipe?.name || "")
  const [recipeUrl, setRecipeUrl] = useState(recipe?.recipeUrl || "")
  const [ingredients, setIngredients] = useState(recipe?.ingredients || [])
  const [addIngredient, setAddIngredient] = useState(false)
  const [ingredient, setIngredient] = useState("")

  useEffect(() => {
    setName(recipe?.name || "")
    setRecipeUrl(recipe?.recipeUrl || "")
    setIngredients(recipe?.ingredients || [])
    setAddIngredient(false)
    setIngredient("")
  }, [recipe, open])

  const valid =
    name &&
    recipes.filter(
      (r) =>
        r.name.trim().toLowerCase() === name.trim().toLowerCase() &&
        r.id !== recipe?.id
    ).length === 0

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (recipe === undefined) {
      await addRecipe({ name, id: "", days: [], recipeUrl, ingredients })
    } else {
      await updateRecipe({ ...recipe, name, recipeUrl, ingredients })
    }
    setName("")
    setRecipeUrl("")
    close()
  }

  function handleAddIngredient() {
    setAddIngredient(true)
  }

  function handleIngredientSubmit() {
    if (ingredient) {
      setIngredients([...ingredients, ingredient.trim()])
      setIngredient("")
      setAddIngredient(false)
    }
  }

  return (
    <Modal isOpen={open} onRequestClose={close} closeTimeoutMS={250}>
      <section className={classes.modal}>
        <div className={classes.header}>
          <h3>{recipe ? "Edit" : "Add"} Recipe</h3>
          <Button onClick={close}>
            <FontAwesomeIcon icon={faWindowClose} size="2x" />
          </Button>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label>
              Recipe Url{" "}
              {recipeUrl && (
                <small>
                  <a href={recipeUrl}>(Visit Site)</a>
                </small>
              )}
            </label>
            <input
              value={recipeUrl}
              onChange={(e) => setRecipeUrl(e.target.value)}
            />
          </div>
          <div>
            <label>
              Ingredients{" "}
              <FontAwesomeIcon
                icon={faPlus}
                style={{ float: "right", cursor: "pointer" }}
                onClick={handleAddIngredient}
              />
            </label>
            {ingredients.length ? (
              ingredients.map((ingredient) => (
                <span style={{ display: "block" }} key={ingredient}>
                  {ingredient}
                </span>
              ))
            ) : (
              <small>No ingredients added yet</small>
            )}
            {addIngredient && (
              <input
                onChange={(e) => setIngredient(e.target.value)}
                onBlur={handleIngredientSubmit}
                autoFocus={true}
              />
            )}
          </div>
          <div className={classes.modalActions}>
            <Button type="button" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" disabled={!valid}>
              Save
            </Button>
          </div>
        </form>
      </section>
    </Modal>
  )
}
