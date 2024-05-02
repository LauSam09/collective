import { ReactNode, createContext, useEffect, useState } from "react";
import { query, collection, onSnapshot } from "firebase/firestore";

import { Recipe } from "@/models/recipe";
import { useAuthentication, useFirebase } from "@/hooks";

interface RecipeContextValue {
  recipes: Array<Recipe>;
  isLoading: boolean;
}

export const RecipeContext = createContext<RecipeContextValue>({
  recipes: [],
  isLoading: true,
});

export interface RecipeContextProviderProps {
  children: ReactNode;
}

export const RecipeContextProvider = ({
  children,
}: RecipeContextProviderProps) => {
  const { firestore } = useFirebase();
  const { appUser } = useAuthentication();
  const [recipes, setRecipes] = useState<Array<Recipe>>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!appUser) {
      return;
    }

    const q = query(
      collection(firestore, "groups", appUser!.group!.id, "recipes"),
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const recipes: Array<Recipe> = [];
      querySnapshot.forEach((doc) => {
        recipes.push({ ...doc.data(), id: doc.id } as unknown as Recipe);
      });
      const sortedRecipes = recipes.sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      setRecipes(sortedRecipes);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [appUser]);

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        isLoading,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};
