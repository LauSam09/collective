import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronsDownUp, ChevronsUpDown, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { batchRemoveRecipeDays, getRecipes, Recipe } from "@/firebase";
import { useUser } from "@/contexts";
import { useLocalStorage } from "@/hooks";
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { RecipeDetailsModal } from "../Recipes/RecipeDetailsModal";

const days: ReadonlyArray<{
  name: string;
  recipes: Array<Recipe>;
  jsIndex: number;
}> = [
  { name: "Monday", recipes: [], jsIndex: 1 },
  { name: "Tuesday", recipes: [], jsIndex: 2 },
  { name: "Wednesday", recipes: [], jsIndex: 3 },
  { name: "Thursday", recipes: [], jsIndex: 4 },
  { name: "Friday", recipes: [], jsIndex: 5 },
  { name: "Saturday", recipes: [], jsIndex: 6 },
  { name: "Sunday", recipes: [], jsIndex: 0 },
];

export const Planning = () => {
  const { groupId } = useUser();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>();
  const dayOfWeek = new Date().getDay();
  const [expandedDays, setExpandedDays] = useLocalStorage<Array<string>>(
    "expanded-planning-days",
    [dayOfWeek.toString()],
  );

  const recipesQuery = useQuery({
    queryKey: ["recipes", groupId],
    queryFn: () => getRecipes(groupId),
  });

  const addedRecipes =
    recipesQuery.data?.filter((r) => r.days && r.days.length > 0) ?? [];

  const daysWithRecipes = addedRecipes.flatMap((r) => r.days ?? []);

  for (const day of days) {
    day.recipes = addedRecipes.filter((recipe) =>
      recipe.days?.includes(day.jsIndex),
    );
  }

  const toggleAllExpanded = () => {
    if (expandedDays.length === days.length) {
      setExpandedDays([]);
    } else {
      setExpandedDays(["0", "1", "2", "3", "4", "5", "6"]);
    }
  };

  const clearWeek = () => {
    const recipeIds = days.flatMap((day) => day.recipes.map((r) => r.id));

    batchRemoveRecipeDays(groupId, recipeIds);
    recipesQuery.refetch();
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-end flex-row gap-2">
        <Button size="icon" onClick={toggleAllExpanded}>
          {expandedDays.length === days.length ? (
            <ChevronsDownUp />
          ) : (
            <ChevronsUpDown />
          )}
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" type="button" size="icon">
              <Trash2 />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                All recipes for the week will be removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={clearWeek}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Accordion
        type="multiple"
        className="w-full"
        value={expandedDays}
        onValueChange={setExpandedDays}
      >
        {days.map((day) => (
          <AccordionItem key={day.jsIndex} value={day.jsIndex.toString()}>
            <AccordionTrigger
              className={day.jsIndex === dayOfWeek ? "font-bold" : ""}
            >
              {day.name} ({day.recipes.length})
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex gap-2">
                {day.recipes.length > 0 ? (
                  day.recipes.map((recipe) => (
                    <Button
                      key={recipe.id}
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedRecipe(recipe)}
                    >
                      {recipe.name}
                    </Button>
                  ))
                ) : (
                  <span>No meals planned</span>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <RecipeDetailsModal
        open={!!selectedRecipe}
        onOpenChange={() => setSelectedRecipe(undefined)}
        recipe={selectedRecipe}
        daysWithRecipes={daysWithRecipes}
      />
    </div>
  );
};
