import { createContext, useState, useEffect, ReactNode } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  increment,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { logEvent } from "firebase/analytics";
import { useDisclosure } from "@chakra-ui/react";

import { useAuthentication, useFirebase } from "@/hooks";
import { Category } from "@/models/category";
import { Item } from "@/models/item";
import { normalizeName } from "@/utilities/normalization";
import { AddItem } from "@/components/List/AddItem";

type CreateItem = {
  name: string;
  category?: string;
};

type ReaddItem = {
  id: string;
  name: string;
  category: string;
};

interface List {
  isLoading: boolean;
  categories: Array<Category>;
  addedItems: Array<Item>;
  unaddedItems: Array<Item>;
  items: Array<Item>;
  openAddItemModal: () => void;
  quickAddItem: (id: string) => void;
  upsertItem: (item: CreateItem | ReaddItem) => void;
  upsertItemByName: (name: string) => void;
  removeItem: (id: string) => void;
}

export const ListContext = createContext<List>({
  isLoading: true,
  categories: [],
  addedItems: [],
  unaddedItems: [],
  items: [],
  openAddItemModal: () => {},
  quickAddItem: async () => {},
  upsertItem: async () => {},
  upsertItemByName: async () => {},
  removeItem: async () => {},
});

interface ListContextProviderProps {
  children: ReactNode;
}

export const ListContextProvider = ({ children }: ListContextProviderProps) => {
  const { analytics, firestore } = useFirebase();
  const { appUser, state } = useAuthentication();
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [items, setItems] = useState<Array<Item>>([]);
  const [isLoading, setLoading] = useState(true);
  const addItemModalDisclosure = useDisclosure();

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
      const categories: Array<Category> = [];
      querySnapshot.forEach((doc) => {
        categories.push({
          ...doc.data(),
          id: doc.id,
          items: [],
        } as unknown as Category);
      });
      setCategories(categories);
      setLoading(false);
    }

    if (!appUser) {
      return;
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
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items: Array<Item> = [];
      querySnapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id } as unknown as Item);
      });
      setItems(items);
    });

    return () => {
      unsubscribe();
    };
  }, [appUser]);

  // TODO: Consider memoizing
  const addedItems: Array<Item> = [],
    unaddedItems: Array<Item> = [];
  items.forEach((i) => (i.added ? addedItems.push(i) : unaddedItems.push(i)));

  const openAddItemModal = () => addItemModalDisclosure.onOpen();

  const upsertItemByName = async (name: string) => {
    const normalizedName = normalizeName(name);
    const existingItem = items.find((i) => i.lowerName === normalizedName) ?? {
      name,
    };

    upsertItem({ ...existingItem, name });
  };

  const upsertItem = (item: CreateItem | ReaddItem) => {
    const itemEntity = {
      added: true,
      completed: false,
      name: item.name,
      notes: "",
    };

    if ("id" in item && item.id) {
      const itemRef = doc(
        firestore,
        "groups",
        appUser!.group.id,
        "lists",
        appUser!.group.defaultList,
        "items",
        item.id,
      );

      updateDoc(itemRef, {
        ...itemEntity,
        category: item.category,
        count: increment(1),
      });

      logEvent(analytics, "add_item");
    } else {
      addDoc(
        collection(
          firestore,
          "groups",
          appUser!.group.id,
          "lists",
          appUser!.group.defaultList,
          "items",
        ),
        {
          ...itemEntity,
          category: item.category ?? "",
          lowerName: normalizeName(item.name),
          count: 1,
        },
      );

      logEvent(analytics, "create_item");
    }
  };

  const quickAddItem = async (id: string) => {
    const itemRef = doc(
      firestore,
      "groups",
      appUser!.group.id,
      "lists",
      appUser!.group.defaultList,
      "items",
      id,
    );

    updateDoc(itemRef, {
      count: increment(1),
      added: true,
    });

    logEvent(analytics, "quick_add_item");
  };

  const removeItem = (id: string) => {
    const itemRef = doc(
      firestore,
      "groups",
      appUser!.group.id,
      "lists",
      appUser!.group.defaultList,
      "items",
      id,
    );

    updateDoc(itemRef, {
      added: false,
      completed: false,
      notes: "",
      count: increment(-1),
    });

    logEvent(analytics, "item_removal");
  };

  return (
    <ListContext.Provider
      value={{
        isLoading,
        categories,
        addedItems,
        unaddedItems,
        items,
        openAddItemModal,
        quickAddItem,
        upsertItem,
        upsertItemByName,
        removeItem,
      }}
    >
      {children}
      {state === "Authenticated" && <AddItem {...addItemModalDisclosure} />}
    </ListContext.Provider>
  );
};
