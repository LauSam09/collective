import * as React from "react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
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

export interface ComboBoxResponsiveProps {
  selectedItem: Item | undefined;
  setSelectedItem: (item: Item | undefined) => void;
}

export function ComboBoxResponsive({
  selectedItem,
  setSelectedItem,
}: ComboBoxResponsiveProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            {selectedItem ? <>{selectedItem.name}</> : <>+ Add item</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <ItemList setOpen={setOpen} setSelectedItem={setSelectedItem} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          {selectedItem ? <>{selectedItem.name}</> : <>+ Add item</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <ItemList setOpen={setOpen} setSelectedItem={setSelectedItem} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function ItemList({
  setOpen,
  setSelectedItem: setSelectedStatus,
}: {
  setOpen: (open: boolean) => void;
  setSelectedItem: (item: Item | undefined) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const filteredItems = useFilteredItems(debouncedSearchQuery);

  const filteredItemCommandItems = filteredItems.map((i) => ({
    value: i.lowerName,
    label: i.name,
  }));

  return (
    <Command shouldFilter={false}>
      <CommandInput
        value={searchQuery}
        onValueChange={setSearchQuery}
        placeholder="Filter items..."
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {filteredItemCommandItems.map((status) => (
            <CommandItem
              key={status.value}
              value={status.value}
              onSelect={(value) => {
                setSelectedStatus(
                  filteredItems.find((item) => item.lowerName === value),
                );
                setOpen(false);
              }}
            >
              {status.label}
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

  // TODO: Add ESLint exhaustive dependencies rule
  useEffect(() => {
    if (!open) {
      setSelectedItem(undefined);
    }
  }, [open]);

  const handleClickAdd = async () => {
    if (!selectedItem) {
      return;
    }

    await addItem(groupId, defaultListId, selectedItem.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add item</DialogTitle>
        </DialogHeader>

        <ComboBoxResponsive
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />

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
