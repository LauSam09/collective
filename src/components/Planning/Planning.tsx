import { useQuery } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "../ui/button";
import { getRecipes, Recipe } from "@/firebase";
import { useUser } from "@/contexts";

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

  const recipesQuery = useQuery({
    queryKey: ["recipes", groupId],
    queryFn: () => getRecipes(groupId),
  });

  const addedRecipes =
    recipesQuery.data?.filter((r) => r.days && r.days.length > 0) ?? [];

  for (const day of days) {
    day.recipes = addedRecipes.filter((recipe) =>
      recipe.days?.includes(day.jsIndex),
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <Accordion
        type="multiple"
        className="w-full"
        // TODO: Put into local storage
        defaultValue={["0", "1", "2", "3", "4", "5", "6"]}
      >
        {days.map((day) => (
          <AccordionItem key={day.jsIndex} value={day.jsIndex.toString()}>
            <AccordionTrigger>{day.name}</AccordionTrigger>
            <AccordionContent>
              <div className="flex gap-2">
                {day.recipes.length > 0 ? (
                  day.recipes.map((recipe) => (
                    <Button key={recipe.id} size="sm" variant="outline">
                      {recipe.name}
                    </Button>
                  ))
                ) : (
                  <span>No recipes planned</span>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
