import React, { FormEvent, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWindowClose } from "@fortawesome/free-solid-svg-icons"

import { Button, Modal } from "components"

import classes from "./RecipeModal.module.css"
import { Recipe } from "models"

type RecipeModalProps = {
  open: boolean
  recipes: Recipe[]
  close: () => void
  addRecipe: (recipe: Recipe) => Promise<void>
}

export default function RecipeModal(props: RecipeModalProps) {
  const { open, recipes, addRecipe, close } = props

  const [name, setName] = useState("")

  const valid =
    name &&
    recipes.filter(
      (recipe) => recipe.name.trim().toLowerCase() === name.trim().toLowerCase()
    ).length === 0

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    await addRecipe({ name, id: "" })
    setName("")
    close()
  }

  return (
    <Modal isOpen={open} onRequestClose={close} closeTimeoutMS={250}>
      <section className={classes.modal}>
        <div className={classes.header}>
          <h3>Add Recipe</h3>
          <Button onClick={close}>
            <FontAwesomeIcon icon={faWindowClose} size="2x" />
          </Button>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className={classes.actions}>
            <button type="submit" disabled={!valid}>
              Save
            </button>
          </div>
        </form>
      </section>
    </Modal>
  )
}
