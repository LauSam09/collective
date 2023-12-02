import { useState } from "react";
import { Button, Flex, Skeleton, Stack, useDisclosure } from "@chakra-ui/react";
import { deleteField, doc, writeBatch } from "firebase/firestore";
import { DeleteIcon } from "@chakra-ui/icons";

import { Category } from "./Category";
import { EditItemModal } from "./EditItemModal";
import { Item } from "./Item";
import { ItemDetailsModal } from "./ItemDetailsModal";
import { Item as ItemModel } from "../../models/item";
import { Category as CategoryModel } from "../../models/category";
import { useList } from "../../hooks/useList";
import { useAuthentication, useFirebase } from "../../hooks";
import { logEvent } from "firebase/analytics";

export const Categories = () => {
  const detailsDisclosure = useDisclosure();
  const editDisclosure = useDisclosure();
  const { firestore, analytics } = useFirebase();
  const { appUser } = useAuthentication();
  const [selectedItem, setSelectedItem] = useState<ItemModel>();
  const { isLoading: loading, categories, addedItems: items } = useList();

  const handleOpenDetails = (item: ItemModel) => {
    setSelectedItem(item);
    detailsDisclosure.onOpen();
  };

  const handleOpenEdit = (item: ItemModel) => {
    setSelectedItem(item);
    editDisclosure.onOpen();
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

  if (loading) {
    return (
      <Stack>
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
      items: items.filter((item) => item.category === category.id),
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
    <>
      <Flex justify="flex-end" mb={2}>
        <Button colorScheme="red" onClick={handleClickClear}>
          <DeleteIcon />
        </Button>
      </Flex>
      <Stack>
        {displayCategories.map((category) => (
          <Category key={category.name} {...category}>
            {category.items.map((item) => (
              <Item
                key={item.id}
                item={item}
                openDetails={() => handleOpenDetails(item)}
                openEdit={() => handleOpenEdit(item)}
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
    </>
  );
};
