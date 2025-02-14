import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Show,
  Stack,
} from "@chakra-ui/react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { OptionsOrGroups, GroupBase, SingleValue } from "react-select";
import AsyncSelect from "react-select/async-creatable";
import ReactSelect from "react-select/dist/declarations/src/Select";

import { useList } from "@/hooks";
import { Item } from "@/models/item";
import { normalizeName } from "@/utilities/normalization";

export type LoadOptionsCallback = (
  options: OptionsOrGroups<
    {
      label: string;
      value: string;
    },
    GroupBase<{
      label: string;
      value: string;
    }>
  >,
) => void;

const DropdownIndicator = () => (
  <ChevronDownIcon width="20px" height="20px" mx="8px" />
);

export type SelectRef = ReactSelect<
  { label: string; value: string },
  false,
  GroupBase<{ label: string; value: string }>
>;

export type AddItemProps = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const AddItem = (props: AddItemProps) => {
  const { isOpen, onClose, onOpen } = props;
  const inputRef = useRef<SelectRef>(null);
  const [category, setCategory] = useState<string>();
  const { items, addedItems, categories, upsertItem } = useList();
  const [selectedItem, setSelectedItem] = useState<Item>();
  const [itemAlreadyAdded, setItemAdded] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setItemAdded(false);
      setSelectedItem(undefined);
      setCategory(undefined);
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <Show above="sm">
        <Button
          variant="solid"
          size="lg"
          position="fixed"
          colorScheme={"blue"}
          bottom={{ base: "20", sm: "4" }}
          right="2"
          zIndex={10}
          onClick={() => onOpen()}
        >
          <AddIcon />
        </Button>
      </Show>
    );
  }

  const loadOptions = (inputValue: string, callback: LoadOptionsCallback) => {
    const normalized = normalizeName(inputValue);

    return callback(
      items
        .filter((o) => o.lowerName.includes(normalized))
        .map((i) => ({
          label: i.name,
          value: i.lowerName,
          category: i.category,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    );
  };

  const handleChange = (
    value: SingleValue<{
      label: string;
      value: string;
    }>,
  ) => {
    setItemAdded(false);
    const item = items.find((o) => o.lowerName === value?.value);

    if (item) {
      setCategory(item.category);
      setSelectedItem(item);

      if (addedItems.find((i) => i.id === item.id)) {
        setItemAdded(true);
      }
    } else if (value?.value) {
      setSelectedItem({
        id: "",
        name: value.value,
        lowerName: normalizeName(value.value),
        category: category ?? categories[0].id,
        notes: "",
        completed: false,
        added: false,
        count: 0,
      });
    } else {
      setCategory(undefined);
      setSelectedItem(undefined);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedItem || itemAlreadyAdded) {
      return;
    }

    const itemCategory = category ?? categories[0].id;

    upsertItem({ ...selectedItem, category: itemCategory });

    inputRef.current?.clearValue();
    inputRef.current?.focus();
    setSelectedItem(undefined);
  };

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      size="3xl"
      blockScrollOnMount={false}
    >
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Add Item</ModalHeader>
          <ModalBody>
            <Stack>
              <AsyncSelect
                name="item"
                value={{
                  label: selectedItem?.name ?? "",
                  value: selectedItem?.name ?? "",
                }}
                isClearable
                components={{ DropdownIndicator }}
                loadOptions={loadOptions}
                ref={inputRef}
                onChange={handleChange}
                classNamePrefix="add-item"
              />
              <Select
                value={category}
                onChange={(e) => setCategory(e.currentTarget.value)}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
              {itemAlreadyAdded && (
                <Alert status="success">
                  <AlertIcon /> Item already added
                </Alert>
              )}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} type="submit">
              Add
            </Button>
            <Button variant="ghost" onClick={onClose} type="button">
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
