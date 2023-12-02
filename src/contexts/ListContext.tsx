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

interface List {
  isLoading: boolean;
  categories: Array<Category>;
  addedItems: Array<Item>;
  unaddedItems: Array<Item>;
  items: Array<Item>;
  upsertItem: (item: Item) => Promise<void>;
}

export const ListContext = createContext<List>({
  isLoading: true,
  categories: [],
  addedItems: [],
  unaddedItems: [],
  items: [],
  upsertItem: async () => {},
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

  const upsertItem = async (item: Item) => {
    const { id, category, name, lowerName } = item;

    const itemEntity = {
      added: true,
      completed: false,
      category,
      name,
      lowerName,
      notes: "",
    };

    if (id) {
      const itemRef = doc(
        firestore,
        "groups",
        appUser!.group.id,
        "lists",
        appUser!.group.defaultList,
        "items",
        id,
      );
      await updateDoc(itemRef, {
        ...itemEntity,
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
      }}
    >
      {children}
    </ListContext.Provider>
  );
};
