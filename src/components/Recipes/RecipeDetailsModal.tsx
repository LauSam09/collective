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
  onEdit,
  onOpenChange,
}: RecipeDetailsModalProps & { onEdit: () => void }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Readonly</DialogTitle>
        </DialogHeader>
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
