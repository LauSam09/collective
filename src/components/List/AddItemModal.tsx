import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { CircleCheck, Square } from "lucide-react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useFilteredItems } from "@/hooks/useFilteredItems";
import { readdItem, Item, addItem } from "@/firebase";
import { useUser } from "@/contexts";
import { useCategories } from "@/hooks";
import { normalizeName } from "@/utilities";

// TODO: Handle uncategorised items

interface HeadlessUiComboBoxProps {
  selectedItem: Item | null;
  onSelectItem: (item: Item | null) => void;
}

function HeadlessUiComboBox({
  selectedItem,
  onSelectItem,
}: HeadlessUiComboBoxProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const filteredItems = useFilteredItems(debouncedSearchQuery);
  const categoriesQuery = useCategories();

  const filteredItemCommandItems = filteredItems.map((i) => ({
    ...i,
    category: categoriesQuery.data?.find((c) => c.id == i.category)?.colour,
  }));

  useEffect(() => {
    if (!selectedItem) {
      setSearchQuery("");
    }
  }, [selectedItem]);

  const handleChange = (item: NoInfer<Item> | null) => {
    if (!item) {
      return;
    }

    if (item.id) {
      onSelectItem({ ...item, name: searchQuery.trim() });
      return;
    }

    const firstCategory = categoriesQuery.data?.[0];

    if (!firstCategory) {
      throw new Error("No categories found");
    }

    onSelectItem({
      lowerName: normalizeName(searchQuery.trim()),
      name: searchQuery.trim(),
      id: "",
      added: false,
      completed: false,
      category: firstCategory.id, // TODO: For now just use the first category
      count: 1,
      notes: "",
    });
  };

  return (
    <Combobox onChange={handleChange} value={selectedItem}>
      <ComboboxInput
        displayValue={(selectedItem: Item) => selectedItem?.name}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder="Search"
        className="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full justify-start"
      />
      <ComboboxOptions
        anchor="bottom"
        className="border empty:invisible z-[60] bg-background w-[var(--input-width)]"
      >
        {searchQuery.length > 0 &&
          searchQuery === debouncedSearchQuery &&
          filteredItems.length === 0 && (
            <ComboboxOption
              value={{ id: null, name: searchQuery }}
              className="data-[focus]:bg-accent py-1"
            >
              Create{" "}
              <span className="font-bold">&quot;{searchQuery}&quot;</span>
            </ComboboxOption>
          )}
        {filteredItemCommandItems.map((item) => (
          <ComboboxOption
            key={item.id}
            value={item}
            className="data-[focus]:bg-accent py-1"
          >
            <div className="flex w-full gap-1 items-center">
              <Square color={`${item.category}`} fill={`${item.category}`} />
              {item.name}
              {item.added && <CircleCheck className="text-green-600" />}
            </div>
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  );
}

type AddItemModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const AddItemModal = ({ open, onOpenChange }: AddItemModalProps) => {
  const { groupId, defaultListId } = useUser();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [comboBoxOpen, setComboBoxOpen] = useState(true);

  useEffect(() => {
    if (open) {
      setComboBoxOpen(true);
    }
  }, [open]);

  // Clear selected item when modal is closed
  useEffect(() => {
    if (!open) {
      setSelectedItem(null);
    }
    // TODO: Add ESLint exhaustive dependencies rule
  }, [open]);

  // Clear selected item when combobox is re-opened
  useEffect(() => {
    if (comboBoxOpen) {
      setSelectedItem(null);
    }
  }, [comboBoxOpen]);

  const handleClickAdd = async () => {
    if (!selectedItem || selectedItem.added) {
      return;
    }

    if (selectedItem.id) {
      readdItem(groupId, defaultListId, selectedItem.id, selectedItem.name);
    } else {
      addItem(groupId, defaultListId, selectedItem);
    }

    setSelectedItem(null);
    setComboBoxOpen(true);
  };

  const handleSelectItem = (item: Item | null) => setSelectedItem(item);

  return (
    // Note: Without `modal={false}` then focus issues on children.
    // See https://github.com/shadcn-ui/ui/issues/3294#issuecomment-2677875313
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add item</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <HeadlessUiComboBox
            selectedItem={selectedItem}
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
