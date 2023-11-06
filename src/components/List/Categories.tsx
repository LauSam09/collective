import { useState } from "react";
import { Skeleton, Stack, useDisclosure } from "@chakra-ui/react";

import { Category } from "./Category";
import { EditItemModal } from "./EditItemModal";
import { Item } from "./Item";
import { ItemDetailsModal } from "./ItemDetailsModal";
import { Item as ItemModel } from "../../models/item";
import { Category as CategoryModel } from "../../models/category";
import { useList } from "../../hooks/useList";

export const Categories = () => {
  const detailsDisclosure = useDisclosure();
  const editDisclosure = useDisclosure();
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

  // TODO: Handle uncategorised. Doing .forEach results in duplicate items.

  return (
    <>
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
      <ItemDetailsModal {...detailsDisclosure} item={selectedItem} />
      <EditItemModal {...editDisclosure} item={selectedItem} />
    </>
  );
};
