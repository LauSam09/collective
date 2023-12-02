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

import { useAuthentication, useFirebase } from "../hooks";
import { Category } from "../models/category";
import { Item } from "../models/item";

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
  upsertItem: (item: CreateItem | ReaddItem) => Promise<void>;
  upsertItemByName: (name: string) => Promise<void>;
}

export const ListContext = createContext<List>({
  isLoading: true,
  categories: [],
  addedItems: [],
  unaddedItems: [],
  items: [],
  upsertItem: async () => {},
  upsertItemByName: async () => {},
});

interface ListContextProviderProps {
  children: ReactNode;
}

export const ListContextProvider = ({ children }: ListContextProviderProps) => {
  const { analytics, firestore } = useFirebase();
  const { appUser } = useAuthentication();
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [items, setItems] = useState<Array<Item>>([]);
  const [isLoading, setLoading] = useState(true);

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

  const upsertItemByName = async (name: string) => {
    const normalisedName = name.toLowerCase();
    const existingItem = items.find((i) => i.lowerName === normalisedName) ?? {
      name,
    };

    await upsertItem({ ...existingItem, name });
  };

  const upsertItem = async (item: CreateItem | ReaddItem) => {
    const itemEntity = {
      added: true,
      completed: false,
      name: item.name,
      notes: "",
    };

    if ("id" in item) {
      const itemRef = doc(
        firestore,
        "groups",
        appUser!.group.id,
        "lists",
        appUser!.group.defaultList,
        "items",
        item.id,
      );
      await updateDoc(itemRef, {
        ...itemEntity,
        category: item.category,
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
          ...itemEntity,
          category: item.category ?? "",
          // TODO: Factor out normalisation and account for plurals
          lowerName: item.name.toLowerCase(),
          count: 1,
        },
      );
      logEvent(analytics, "create_item");
    }
  };

  return (
    <ListContext.Provider
      value={{
        isLoading,
        categories,
        addedItems,
        unaddedItems,
        items,
        upsertItem,
        upsertItemByName,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};
