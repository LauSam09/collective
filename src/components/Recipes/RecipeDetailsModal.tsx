import { Recipe } from "@/firebase";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ExternalLink } from "lucide-react";
import { Badge } from "../ui/badge";

type RecipeDetailsModalProps = {
  recipe: Recipe | undefined;
  open: boolean;

  onOpenChange: (open: boolean) => void;
};

// TODO: Consider factoring out common modal elements.
export const RecipeDetailsModal = (props: RecipeDetailsModalProps) => {
  const [mode, setMode] = useState<"readonly" | "edit">("readonly");

  useEffect(() => {
    if (!props.open) {
      setMode("readonly");
    }
  }, [props.open]);

  switch (mode) {
    case "readonly":
      return <ReadonlyDetailsModal {...props} onEdit={() => setMode("edit")} />;
    case "edit":
      return <EditDetailsModal {...props} />;
  }
};

const ReadonlyDetailsModal = ({
  open,
  recipe,
  onEdit,
  onOpenChange,
}: RecipeDetailsModalProps & { onEdit: () => void }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{recipe?.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="font-bold">External link</h2>
            {recipe?.recipeUrl ? (
              <a
                href={recipe.recipeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-sm text-blue-600 dark:text-blue-500 hover:underline"
              >
                <span>{recipe?.recipeUrl}</span>
                <ExternalLink size="16" className="inline ml-1" />
              </a>
            ) : (
              "n/a"
            )}
          </div>

          <div>
            <h2 className="font-bold">Ingredients</h2>
            {recipe?.ingredients && recipe.ingredients.length > 0 ? (
              <ul className="flex flex-row flex-wrap gap-1">
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient} className="inline">
                    <Badge>{ingredient}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              "n/a"
            )}
          </div>

          <div>
            <h2 className="font-bold">Notes</h2>
            <p>{recipe?.notes || "n/a"}</p>
          </div>

          <div>
            <h2 className="font-bold">Tags</h2>
            {recipe?.tags && recipe.tags.length > 0 ? (
              <ul className="flex flex-row flex-wrap gap-1">
                {recipe.tags.map((tag) => (
                  <li key={tag} className="inline">
                    <Badge>{tag}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              "n/a"
            )}
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="secondary" onClick={onEdit}>
            Edit
          </Button>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EditDetailsModal = ({ open, onOpenChange }: RecipeDetailsModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
