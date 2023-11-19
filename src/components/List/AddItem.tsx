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
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { createRef, FormEvent, useState } from "react";
import { OptionsOrGroups, GroupBase, SingleValue } from "react-select";
import AsyncSelect from "react-select/async-creatable";
import ReactSelect from "react-select/dist/declarations/src/Select";
import {
  addDoc,
  collection,
  doc,
  increment,
  updateDoc,
} from "firebase/firestore";
import { logEvent } from "firebase/analytics";

import { useList } from "../../hooks/useList";
import { useAuthentication, useFirebase } from "../../hooks";
import { Item } from "../../models/item";

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

export const AddItem = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const inputRef = createRef<SelectRef>();
  const [category, setCategory] = useState<string>();
  const { items, addedItems, categories } = useList();
  const { firestore, analytics } = useFirebase();
  const { appUser } = useAuthentication();
  const [selectedItem, setSelectedItem] = useState<Item>();
  const [itemAlreadyAdded, setItemAdded] = useState(false);

  if (!isOpen) {
    return (
      <Button
        variant="solid"
        size="lg"
        position="fixed"
        colorScheme={"blue"}
        bottom="4"
        right="4"
        zIndex={10}
        onClick={() => onOpen()}
      >
        <AddIcon />
      </Button>
    );
  }

  const loadOptions = (inputValue: string, callback: LoadOptionsCallback) => {
    const lowerName = inputValue.toLowerCase();

    return callback(
      items
        .filter((o) => o.lowerName.includes(lowerName))
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
        lowerName: value.value.toLowerCase(),
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

    if (selectedItem.id) {
      const itemRef = doc(
        firestore,
        "groups",
        appUser!.group.id,
        "lists",
        appUser!.group.defaultList,
        "items",
        selectedItem.id,
      );
      await updateDoc(itemRef, {
        added: true,
        category: category ?? categories[0].id,
        count: increment(1),
      });
      logEvent(analytics, "add_item");
    } else {
      await addDoc(
        collection(
          firestore,
          "groups",
          appUser!.group.id,
          "lists",
          appUser!.group.defaultList,
          "items",
        ),
        {
          name: selectedItem.name,
          lowerName: selectedItem.lowerName,
          completed: false,
          notes: undefined,
          added: true,
          category: category ?? categories[0].id,
          count: 1,
        },
      );
      logEvent(analytics, "create_item");
    }

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
