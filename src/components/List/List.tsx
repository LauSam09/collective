import { useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Skeleton,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { deleteField, doc, writeBatch } from "firebase/firestore";
import {
  AddIcon,
  DeleteIcon,
  RepeatIcon,
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";
import { logEvent } from "firebase/analytics";

import { Category } from "./Category";
import { EditItemModal } from "./EditItemModal";
import { Item } from "./Item";
import { ItemDetailsModal } from "./ItemDetailsModal";
import { Item as ItemModel } from "@/models/item";
import { Category as CategoryModel } from "@/models/category";
import { useAuthentication, useFirebase, useList } from "@/hooks";
import { FavouritesModal } from "./FavouritesModal";

export const List = () => {
  const detailsDisclosure = useDisclosure();
  const editDisclosure = useDisclosure();
  const favouritesDisclosure = useDisclosure();
  const { firestore, analytics } = useFirebase();
  const { appUser } = useAuthentication();
  const [selectedItem, setSelectedItem] = useState<ItemModel>();
  const [hideCompleted, setHideCompleted] = useState(false);
  const {
    isLoading: isLoading,
    categories,
    addedItems: items,
    openAddItemModal,
  } = useList();

  const handleOpenDetails = (item: ItemModel) => {
    setSelectedItem(item);
    detailsDisclosure.onOpen();
  };

  const handleClickClear = () => {
    const batch = writeBatch(firestore);

    for (const item of items.filter((item) => item.completed)) {
      const itemRef = doc(
        firestore,
        "groups",
        appUser!.group.id,
        "lists",
        appUser!.group.defaultList,
        "items",
        item.id,
      );
      batch.update(itemRef, {
        completed: false,
        added: false,
        notes: deleteField(),
        flagged: deleteField(),
      });
    }

    batch.commit();

    logEvent(analytics, "clear_completed");
  };

  const handleClickDetailsEdit = () => {
    detailsDisclosure.onClose();
    editDisclosure.onOpen();
  };

  if (isLoading) {
    return (
      <Stack py={2}>
        {[
          { name: "", colour: "" },
          { name: "", colour: "" },
          { name: "", colour: "" },
        ].map((category, i) => (
          <Skeleton key={i}>
            <Category {...category} />
          </Skeleton>
        ))}
      </Stack>
    );
  }

  const displayCategories: Array<CategoryModel> = categories
    .map((category) => ({
      ...category,
      items: items
        .filter(
          (item) =>
            item.category === category.id &&
            ((hideCompleted && !item.completed) || !hideCompleted),
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.order - b.order);

  const uncategorisedItems = items.filter((item) => !item.category);

  if (uncategorisedItems.length > 0) {
    displayCategories.unshift({
      id: "",
      name: "Uncategorised",
      colour: "#d4d5d6",
      order: 0,
      items: uncategorisedItems,
    });
  }

  return (
    <Box>
      <Flex justify={{ base: "space-evenly", sm: "flex-end" }} mb={2} gap={2}>
        <IconButton
          colorScheme="blue"
          icon={<AddIcon />}
          size="lg"
          aria-label="Add item"
          onClick={openAddItemModal}
        />
        <IconButton
          icon={<RepeatIcon />}
          size="lg"
          aria-label="Frequent items"
          onClick={favouritesDisclosure.onOpen}
        />
        <IconButton
          icon={hideCompleted ? <ViewIcon /> : <ViewOffIcon />}
          size="lg"
          aria-label="Toggle displaying completed items"
          onClick={() => setHideCompleted((hideCompleted) => !hideCompleted)}
        />
        <IconButton
          colorScheme="red"
          icon={<DeleteIcon />}
          size="lg"
          aria-label="Clear completed items"
          onClick={handleClickClear}
        />
      </Flex>
      <Stack>
        {displayCategories.map((category) => (
          <Category key={category.name} {...category}>
            {category.items.map((item) => (
              <Item
                key={item.id}
                item={item}
                openDetails={() => handleOpenDetails(item)}
              />
            ))}
          </Category>
        ))}
      </Stack>
      <ItemDetailsModal
        {...detailsDisclosure}
        item={selectedItem}
        onEdit={handleClickDetailsEdit}
      />
      <EditItemModal {...editDisclosure} item={selectedItem} />
      <FavouritesModal {...favouritesDisclosure} />
    </Box>
  );
};
