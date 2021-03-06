import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons"
import { useFieldArray, useForm } from "react-hook-form"

import { Button, FormGroup, Modal } from "Common"
import { RecipeModel, useRecipes } from "Recipes"

import classes from "./WriteRecipe.module.css"

interface Ingredient {
  name: string
}

interface RecipeFormModel {
  name: string
  ingredients: Array<Ingredient>
  recipeUrl?: string
}

interface WriteRecipeProps {
  recipe: RecipeModel
  close: () => void
  onSave: (recipe: RecipeModel) => void
}

export const WriteRecipe = (props: WriteRecipeProps) => {
  const { recipe, close, onSave } = props
  const { control, formState, handleSubmit, register } =
    useForm<RecipeFormModel>({
      mode: "onChange",
      defaultValues: {
        ...recipe,
        ingredients: recipe.ingredients?.map((i) => ({ name: i })) ?? [],
      },
    })
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  })
  const { addRecipe, updateRecipe } = useRecipes()
  const { errors } = formState
  const adding = !recipe.id

  const saveRecipe = async (data: RecipeFormModel) => {
    const modifiedRecipe: RecipeModel = {
      ...recipe,
      ...data,
      ingredients:
        data.ingredients?.filter((i) => i.name !== "").map((i) => i.name) ?? [],
    }

    if (adding) {
      await addRecipe(modifiedRecipe)
      close()
    } else {
      await updateRecipe(modifiedRecipe)
      onSave(modifiedRecipe)
    }
  }

  return (
    <>
      <Modal.Header>
        <h4>{adding ? "New recipe" : recipe.name}</h4>
      </Modal.Header>
      <form onSubmit={handleSubmit(saveRecipe)}>
        <FormGroup>
          <label htmlFor="name">Name*</label>
          <input
            id="name"
            placeholder="Name"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name ? (
            <small className={classes.invalid}>{errors.name.message}</small>
          ) : null}
        </FormGroup>
        <FormGroup>
          <label htmlFor="recipeUrl">Recipe Url</label>
          <input
            id="recipeUrl"
            placeholder="Recipe Url"
            {...register("recipeUrl", {
              validate: {
                isUrl: (value: string | undefined) => {
                  try {
                    value && new URL(value)
                  } catch (err) {
                    return "Invalid url"
                  }
                  return true
                },
              },
            })}
            name="recipeUrl"
            className={classes.url}
          />
          {errors.recipeUrl ? (
            <small className={classes.invalid}>
              {errors.recipeUrl.message}
            </small>
          ) : null}
        </FormGroup>
        <FormGroup>
          <label>
            Ingredients
            <Button type="button" onClick={() => append({ name: "" })}>
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </label>

          {fields.map((field, index) => (
            <div key={field.id} className={classes.ingredient}>
              <input
                {...register(`ingredients.${index}.name` as const)}
                defaultValue={field.name}
                placeholder={`Ingredient ${index + 1}`}
              />
              <Button type="button" onClick={() => remove(index)}>
                <FontAwesomeIcon icon={faMinus} />
              </Button>
            </div>
          ))}
          {fields.length === 0 ? <span>No ingredients added yet</span> : null}
        </FormGroup>
        <div className={classes.actions}>
          <Button
            onClick={close}
            type="button"
            className={classes.secondaryButton}
          >
            Close
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </>
  )
}
