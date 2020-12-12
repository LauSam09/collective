import React, { FormEvent, useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave, faWindowClose } from "@fortawesome/free-solid-svg-icons"

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

  useEffect(() => {
    setName(recipe?.name || "")
    setRecipeUrl(recipe?.recipeUrl || "")
  }, [recipe])

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
      await addRecipe({ name, id: "", days: [], recipeUrl })
    } else {
      await updateRecipe({ ...recipe, name, recipeUrl })
    }
    setName("")
    setRecipeUrl("")
    close()
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

          <div className={classes.actions}>
            <Button type="submit" disabled={!valid}>
              <FontAwesomeIcon
                icon={faSave}
                size="2x"
                style={{ color: valid ? "inherit" : "grey" }}
              />
            </Button>
          </div>
        </form>
      </section>
    </Modal>
  )
}
