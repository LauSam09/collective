import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { CircleCheck, Square } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFilteredItems } from "@/hooks/useFilteredItems";
import { addItem, Item } from "@/firebase";
import { useUser } from "@/contexts";
import { useCategories } from "@/hooks";

export interface ComboBoxResponsiveProps {
  selectedItem: Item | undefined;
  open: boolean;
  onSelectItem: (item: Item | undefined) => void;
  onToggle: (open: boolean) => void;
}

export function ComboBoxResponsive({
  selectedItem,
  open,
  onSelectItem,
  onToggle,
}: ComboBoxResponsiveProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={onToggle}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            {selectedItem ? <>{selectedItem.name}</> : <>+ Add item</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <ItemList setOpen={onToggle} setSelectedItem={onSelectItem} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onToggle}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          {selectedItem ? <>{selectedItem.name}</> : <>+ Add item</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <ItemList setOpen={onToggle} setSelectedItem={onSelectItem} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export interface ItemListProps {
  setOpen: (open: boolean) => void;
  setSelectedItem: (item: Item | undefined) => void;
}

function ItemList({ setOpen, setSelectedItem }: ItemListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const filteredItems = useFilteredItems(debouncedSearchQuery);
  const categoriesQuery = useCategories();

  const filteredItemCommandItems = filteredItems.map((i) => ({
    value: i.lowerName,
    label: i.name,
    category: categoriesQuery.data?.find((c) => c.id == i.category)?.colour,
  }));

  return (
    <Command shouldFilter={false}>
      <CommandInput
        value={searchQuery}
        onValueChange={setSearchQuery}
        placeholder="Filter items..."
        // TODO: Autofocus isn't working here for some reason.
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {filteredItemCommandItems.map((item) => (
            <CommandItem
              key={item.value}
              value={item.value}
              // TODO: This is not firing on desktop for some reason
              onSelect={(value) => {
                setSelectedItem(
                  filteredItems.find((item) => item.lowerName === value),
                );
                setOpen(false);
              }}
            >
              <div className="flex w-full gap-1 items-center">
                <Square color={`${item.category}`} fill={`${item.category}`} />
                {item.label}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

type AddItemModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const AddItemModal = ({ open, onOpenChange }: AddItemModalProps) => {
  const { groupId, defaultListId } = useUser();
  const [selectedItem, setSelectedItem] = useState<Item>();
  const [comboBoxOpen, setComboBoxOpen] = useState(true);

  // TODO: Add ESLint exhaustive dependencies rule
  useEffect(() => {
    if (!open) {
      setSelectedItem(undefined);
    }
  }, [open]);

  const handleClickAdd = async () => {
    if (!selectedItem || selectedItem.added) {
      return;
    }

    addItem(groupId, defaultListId, selectedItem.id);
    setSelectedItem(undefined);
    setComboBoxOpen(true);
  };

  const handleSelectItem = (item: Item | undefined) => setSelectedItem(item);

  const handleToggleComboBox = (open: boolean) => setComboBoxOpen(open);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add item</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <ComboBoxResponsive
            open={comboBoxOpen}
            selectedItem={selectedItem}
            onToggle={handleToggleComboBox}
            onSelectItem={handleSelectItem}
          />
          {selectedItem?.added && (
            <div className="text-green-600 flex gap-1">
              <CircleCheck />
              <p>Added</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleClickAdd}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
