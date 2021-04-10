import { RecipeList } from "./RecipeList"
import { useRecipes } from "./useRecipes"
import { WeeklyRecipes } from "./WeeklyRecipes"

export function Recipes() {
  const { recipes } = useRecipes()

  return (
    <>
      <WeeklyRecipes recipes={recipes} />
      {/* TODO add filter */}
      <RecipeList recipes={recipes} />
    </>
  )
}
