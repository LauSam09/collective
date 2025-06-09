import { Plus, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUser } from "@/contexts";
import { readdItem } from "@/firebase";
import { useCategories } from "@/hooks";
import { useItems } from "@/hooks/useItems";

type QuickAddModalProps = {
  open: boolean;
  onClose: () => void;
};

export const QuickAddModal = ({ open, onClose }: QuickAddModalProps) => {
  const itemsQuery = useItems();
  const categoriesQuery = useCategories();
  const { defaultListId, groupId } = useUser();

  const items = [...(itemsQuery.data ?? [])];

  const topItems = items
    .filter((i) => !i.added)
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  const handleClick = (id: string, name: string) => {
    readdItem(groupId, defaultListId, id, name);
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categoriesQuery.data?.find((c) => c.id === categoryId);

    return category ? category.colour : "gray";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Quick add</DialogTitle>
          <DialogDescription>
            Your frequently added items are listed here.
          </DialogDescription>
        </DialogHeader>
        <ol className="space-y-2">
          {topItems.map((item) => (
            <li key={item.id} className="flex">
              <Button
                variant="secondary"
                onClick={() => handleClick(item.id, item.name)}
              >
                <Square
                  color={`${getCategoryColor(item.category)}`}
                  fill={`${getCategoryColor(item.category)}`}
                />
                <span>{item.name}</span>
                <Plus />
              </Button>
            </li>
          ))}
        </ol>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
