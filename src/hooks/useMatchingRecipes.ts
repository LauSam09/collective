import { useAddedRecipes } from "./useAddedRecipes";
import { normalizeName } from "@/utilities";

export const useMatchingRecipes = (lowerName: string) => {
  const addedRecipesQuery = useAddedRecipes();

  const matchingRecipes = (addedRecipesQuery.data ?? []).filter((recipe) =>
    recipe.ingredients.map(normalizeName).includes(lowerName),
  );

  return { ...addedRecipesQuery, data: matchingRecipes };
};
