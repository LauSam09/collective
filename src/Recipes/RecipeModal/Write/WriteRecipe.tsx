import { useFieldArray, useForm } from "react-hook-form"

import { Modal } from "Common"
import { Recipe } from "Recipes/models"
import { useRecipes } from "Recipes"

interface RecipeFormModel {
  name: string
  recipeUrl?: string
  ingredients?: {
    name: string
  }[]
}

type WriteRecipeProps = {
  recipe: Recipe
  close: () => void
  onSave: (recipe: Recipe) => void
}

export function WriteRecipe(props: WriteRecipeProps) {
  const { recipe, close, onSave } = props
  const {
    control,
    formState,
    handleSubmit,
    register,
  } = useForm<RecipeFormModel>({
    mode: "onChange",
    defaultValues: {
      ...recipe,
      ingredients: recipe.ingredients?.map((i) => ({ name: i })) || [],
    },
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  })
  const { addRecipe, updateRecipe } = useRecipes()
  const { isValid, isDirty } = formState
  const adding = !recipe.id

  const saveDisabled = !isValid || !isDirty

  const saveRecipe = async (data: RecipeFormModel) => {
    const modifiedRecipe: Recipe = {
      ...recipe,
      ...data,
      ingredients: data.ingredients?.map((i) => i.name) ?? [],
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
      <Modal.Header>{adding ? "New recipe" : recipe.name}</Modal.Header>
      <form onSubmit={handleSubmit(saveRecipe)}>
        <label htmlFor="name">Name</label>
        <input id="name" ref={register({ required: true })} name="name" />
        <label htmlFor="recipeUrl">Recipe Url</label>
        <input id="recipeUrl" ref={register} name="recipeUrl" />
        <label>Ingredients</label>
        <button type="button" onClick={append}>
          Add
        </button>
        {fields.map((field, index) => (
          <div key={field.id}>
            <input
              ref={register({ required: true })}
              name={`ingredients[${index}].name`}
              defaultValue={field.name}
            />
            <button type="button" onClick={() => remove(index)}>
              Remove
            </button>
          </div>
        ))}
        <button onClick={close} type="button">
          Close
        </button>
        <button disabled={saveDisabled} type="submit">
          Save
        </button>
      </form>
    </>
  )
}
