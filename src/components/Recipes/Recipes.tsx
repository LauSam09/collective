import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "../ui/pagination";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/contexts";
import { getRecipes } from "@/firebase";

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
  const pageSize = 40;
  const [page, setPage] = useState(0);
  const { groupId } = useUser();

  const recipesQuery = useQuery({
    queryKey: ["recipes"],
    queryFn: () => getRecipes(groupId),
  });

  if (recipesQuery.isFetching) {
    return <span>Loading...</span>;
  }

  const totalPages = Math.ceil(recipesQuery.data!.length / pageSize);

  const paginatedRecipes = recipesQuery.data!.slice(
    page * pageSize,
    (page + 1) * pageSize,
  );

  const handleClickPrevious = () => {
    if (page > 0) {
      setPage((page) => page - 1);
    }
  };

  const handleClickNext = () => {
    if (page < totalPages - 1) {
      setPage((page) => page + 1);
    }
  };

  return (
    <>
      <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mx-auto gap-1">
        {paginatedRecipes.map((recipe) => (
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
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" onClick={handleClickPrevious} />
          </PaginationItem>

          {Array.from({ length: totalPages }).map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                onClick={() => setPage(index)}
                isActive={index === page}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext href="#" onClick={handleClickNext} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export const Recipes = () => (
  <>
    <RecipeList />
  </>
);
