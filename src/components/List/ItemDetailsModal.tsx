import { Item } from "@/firebase";
import { useCategories, useMatchingRecipes } from "@/hooks";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

type ItemDetailsModalProps = {
  item: Item | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ItemDetailsModal = ({
  item,
  open,
  onOpenChange,
}: ItemDetailsModalProps) => {
  const matchingRecipesQuery = useMatchingRecipes(item?.lowerName ?? "");
  const categoriesQuery = useCategories();

  const category = (categoriesQuery.data ?? []).find(
    (c) => item?.category === c.id,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {item?.name}
            <Badge
              className="text-xs p-1 ml-2 text-black dark:text-white"
              style={{ backgroundColor: `${category?.colour}50` }}
            >
              {category?.name}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="font-bold">Notes</h2>
            <p>{item?.notes || "n/a"}</p>
          </div>

          <div>
            <h2 className="font-bold">Selected Recipes</h2>
            {/* TODO: Make these links? */}
            {matchingRecipesQuery.data?.length > 0 ? (
              <ul className="list-disc pl-4">
                {matchingRecipesQuery.data.map((recipe) => (
                  <li key={recipe.id}>{recipe.name}</li>
                ))}
              </ul>
            ) : (
              <p>n/a</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
