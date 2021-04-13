import { Modal } from "Common"
import { Recipe } from "Recipes/models"

type WriteRecipeProps = {
  recipe: Recipe
  close: () => void
  read: () => void
}

export function WriteRecipe(props: WriteRecipeProps) {
  const { recipe, close, read } = props

  return (
    <>
      <Modal.Header>{recipe.name}</Modal.Header>
      <label>Recipe Url</label>
      <input value={recipe.recipeUrl} />
      <label>Ingredients</label>
      {(recipe.ingredients ?? []).length > 0 ? (
        recipe.ingredients?.map((i, index) => <input value={i} key={index} />)
      ) : (
        <span>No ingredients added</span>
      )}
      <button onClick={close}>Close</button>
      <button onClick={read}>Save</button>
    </>
  )
}
