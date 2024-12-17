import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

type AddItemModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const AddItemModal = ({ open, onOpenChange }: AddItemModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add item</DialogTitle>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={() => onOpenChange(false)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
