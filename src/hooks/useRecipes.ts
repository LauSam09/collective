import { useContext } from "react";

import { RecipeContext } from "../contexts/RecipeContext";

const useRecipes = () => {
  const recipesContext = useContext(RecipeContext);

  if (!recipesContext) {
    throw new Error("useRecipes must be used within a RecipesProvider");
  }

  return recipesContext;
};

export default useRecipes;
