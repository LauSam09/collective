import { useEffect, useState } from "react";
import { ExternalLink, Plus, X } from "lucide-react";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "../ui/pagination";
import { useUser } from "@/contexts";
import { getRecipes, Recipe } from "@/firebase";
import { RecipeDetailsModal } from "./RecipeDetailsModal";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { AddRecipeModal } from "./AddRecipeModal";
import { SearchFiltersModal } from "./SearchFiltersModal";

const RecipeList = () => {
  const pageSize = 40;
  const [page, setPage] = useState(0);
  const { groupId } = useUser();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddRecipeOpen, setIsAddRecipeOpen] = useState(false);
  const [selectedRecipe, setSelectedItem] = useState<Recipe>();
  const [cuisineTags, setCuisineTags] = useState<string[]>([]);
  const [typeTags, setTypeTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const normalisedFilterValue = debouncedSearchQuery.trim().toLowerCase();

  const filteringApplied =
    cuisineTags.length > 0 || typeTags.length > 0 || normalisedFilterValue;

  const recipesQuery = useQuery({
    queryKey: ["recipes", groupId],
    queryFn: () => getRecipes(groupId),
  });

  const addedRecipes =
    recipesQuery.data?.filter((r) => r.days && r.days.length > 0) ?? [];

  const daysWithRecipes = addedRecipes.flatMap((r) => r.days ?? []);

  // When recipes are changed we need to update the selected item.
  useEffect(() => {
    setSelectedItem((old) => {
      if (!old) {
        return undefined;
      }

      return recipesQuery.data?.find((r) => r.id === old.id);
    });
  }, [recipesQuery.data]);

  const filteredRecipes = filteringApplied
    ? recipesQuery.data
        ?.filter(
          (r) =>
            cuisineTags.length === 0 ||
            r.tags?.some((tag) => cuisineTags.includes(tag)),
        )
        ?.filter(
          (r) =>
            typeTags.length === 0 ||
            r.tags?.some((tag) => typeTags.includes(tag)),
        )
        .filter(
          (r) =>
            r.name.toLowerCase().includes(normalisedFilterValue) ||
            r.ingredients?.some((i) =>
              i.toLowerCase().includes(normalisedFilterValue),
            ),
        )
    : recipesQuery.data;

  if (recipesQuery.isFetching) {
    return <span>Loading...</span>;
  }

  const totalPages = Math.ceil(filteredRecipes!.length / pageSize);

  const paginatedRecipes = filteredRecipes!.slice(
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

  const handleClickRecipe = (recipe: Recipe) => {
    setSelectedItem(recipe);
    setIsDetailsOpen(true);
  };

  return (
    <>
      <div className="flex justify-between gap-3">
        <Button size="icon" onClick={() => setIsAddRecipeOpen(true)}>
          <Plus />
        </Button>
        <form className="mb-2 flex-1 max-w-sm flex gap-1 ml-3">
          <Input
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setSearchQuery("")}
          >
            <X />
          </Button>
          <SearchFiltersModal
            selectedCuisineTags={cuisineTags}
            setCuisineTags={setCuisineTags}
            selectedTypeTags={typeTags}
            setTypeTags={setTypeTags}
          />
        </form>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mx-auto gap-1">
        {paginatedRecipes.map((recipe) => (
          <li key={recipe.name}>
            <Card
              onClick={() => handleClickRecipe(recipe)}
              className="cursor-pointer"
            >
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
      {paginatedRecipes.length > 0 ? (
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
      ) : (
        <div className="text-center">No recipes found</div>
      )}

      <RecipeDetailsModal
        open={isDetailsOpen}
        recipe={selectedRecipe}
        onOpenChange={setIsDetailsOpen}
        daysWithRecipes={daysWithRecipes}
      />

      <AddRecipeModal
        open={isAddRecipeOpen}
        onClose={() => setIsAddRecipeOpen(false)}
      />
    </>
  );
};

export const Recipes = () => <RecipeList />;
