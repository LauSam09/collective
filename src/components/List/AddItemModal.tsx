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
import { readdItem, Item, addItem } from "@/firebase";
import { useUser } from "@/contexts";
import { useCategories } from "@/hooks";
import { normalizeName } from "@/utilities";

// TODO: Handle uncategorised items

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
  const categoriesQuery = useCategories();

  const itemCategory = categoriesQuery.data?.find(
    (c) => c.id == selectedItem?.category,
  )?.colour;

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={onToggle}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            {selectedItem ? (
              <div className="flex w-full gap-1 items-center">
                <Square color={`${itemCategory}`} fill={`${itemCategory}`} />
                {selectedItem.name}
              </div>
            ) : (
              <>+ Add item</>
            )}
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
          {selectedItem ? (
            <div className="flex w-full gap-1 items-center">
              <Square color={`${itemCategory}`} fill={`${itemCategory}`} />
              {selectedItem.name}
            </div>
          ) : (
            <>+ Add item</>
          )}
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
    added: i.added,
    category: categoriesQuery.data?.find((c) => c.id == i.category)?.colour,
  }));

  const handleClickNew = () => {
    setSelectedItem({
      lowerName: normalizeName(searchQuery.trim()),
      name: searchQuery.trim(),
      id: "",
      added: false,
      completed: false,
      category: categoriesQuery.data?.[0].id!, // TODO: For now just use the first category
      count: 1,
      notes: "",
    });
    setOpen(false);
  };

  return (
    <Command shouldFilter={false}>
      <CommandInput
        value={searchQuery}
        onValueChange={setSearchQuery}
        placeholder="Filter items..."
        autoFocus
        // TODO: Autofocus isn't working here for some reason.
      />
      <CommandList>
        <CommandEmpty>
          {searchQuery.length > 0 && searchQuery == debouncedSearchQuery ? (
            <Button onClick={handleClickNew}>Add new</Button>
          ) : (
            "No results found."
          )}
        </CommandEmpty>
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
                {item.added && <CircleCheck className="text-green-600" />}
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

  useEffect(() => {
    if (open) {
      setComboBoxOpen(true);
    }
  }, [open]);

  // Clear selected item when modal is closed
  useEffect(() => {
    if (!open) {
      setSelectedItem(undefined);
    }
    // TODO: Add ESLint exhaustive dependencies rule
  }, [open]);

  // Clear selected item when combobox is re-opened
  useEffect(() => {
    if (comboBoxOpen) {
      setSelectedItem(undefined);
    }
  }, [comboBoxOpen]);

  const handleClickAdd = async () => {
    if (!selectedItem || selectedItem.added) {
      return;
    }

    if (selectedItem.id) {
      readdItem(groupId, defaultListId, selectedItem.id);
    } else {
      addItem(groupId, defaultListId, selectedItem);
    }

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
