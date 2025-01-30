import { ExternalLink } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

const recipes = [
  {
    name: "Artichoke and mushroom pie",
    recipeUrl:
      "https://www.bbcgoodfood.com/recipes/artichoke-wild-mushroom-pie",
    tags: [],
    notes: "",
    ingredients: [
      "artichoke",
      "mushroom",
      "shortcrust pastry",
      "onion",
      "garlic",
      "mushrooms",
    ],
  },
  {
    name: "Artichoke pizza",
    recipeUrl: undefined,
    tags: [],
    notes: "",
    ingredients: [],
  },
  {
    name: "Avocado chickpea smash",
    recipeUrl: undefined,
    tags: [],
    notes: "",
    ingredients: [],
  },
  {
    name: "Bangers and mash",
    recipeUrl: undefined,
    tags: [],
    notes: "",
    ingredients: [],
  },
  {
    name: "Blue cheese risotto",
    recipeUrl: undefined,
    tags: [],
    notes: "",
    ingredients: ["blue cheese", "risotto rice"],
  },
];

const RecipeList = () => {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mx-auto gap-1">
      {recipes.map((recipe) => (
        <li key={recipe.name}>
          <Card>
            <CardHeader>
              <CardTitle className="flex gap-1">
                {recipe.name}
                {recipe.recipeUrl && (
                  <a
                    href={recipe.recipeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size="16" />
                  </a>
                )}
              </CardTitle>
              {recipe.ingredients && recipe.ingredients.length > 0 && (
                <CardDescription className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                  {/* TODO: Consider limiting number of ingredients */}
                  {recipe.ingredients.join(", ")}
                </CardDescription>
              )}
            </CardHeader>
          </Card>
        </li>
      ))}
    </ul>
  );
};

export const Recipes = () => (
  <>
    <RecipeList />
  </>
);
