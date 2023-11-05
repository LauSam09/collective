import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Skeleton, Stack, useDisclosure } from "@chakra-ui/react";

import { Category } from "./Category";
import { EditItemModal } from "./EditItemModal";
import { Item } from "./Item";
import { ItemDetailsModal } from "./ItemDetailsModal";
import { useFirebase, useAuthentication } from "../../hooks";
import { Item as ItemModel } from "../../models/item";
import { Category as CategoryModel } from "../../models/category";

export const Categories = () => {
  const detailsDisclosure = useDisclosure();
  const editDisclosure = useDisclosure();
  const [selectedItem, setSelectedItem] = useState<ItemModel>();
  const { firestore } = useFirebase();
  const { appUser } = useAuthentication();
  const [categories, setCategories] = useState<Array<CategoryModel>>([]);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Array<ItemModel>>([]);

  useEffect(() => {
    async function fetchCategories() {
      const querySnapshot = await getDocs(
        collection(
          firestore,
          "groups",
          appUser!.group!.id,
          "lists",
          appUser!.group.defaultList,
          "categories",
        ),
      );
      const categories: Array<CategoryModel> = [];
      querySnapshot.forEach((doc) => {
        categories.push({
          ...doc.data(),
          id: doc.id,
          items: [],
        } as unknown as CategoryModel);
      });
      setCategories(categories);
      setLoading(false);
    }

    fetchCategories();

    const q = query(
      collection(
        firestore,
        "groups",
        appUser!.group.id,
        "lists",
        appUser!.group.defaultList,
        "items",
      ),
      where("added", "==", true),
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items: Array<ItemModel> = [];
      querySnapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id } as unknown as ItemModel);
      });
      setItems(items);
    });

    return () => {
      unsubscribe();
    };
  }, []);

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
