import { createContext, useState, useEffect } from "react";
import { collection, getDocs, onSnapshot, query } from "firebase/firestore";

import { useAuthentication, useFirebase } from "../hooks";
import { Category } from "../models/category";
import { Item } from "../models/item";

interface List {
  isLoading: boolean;
  categories: Array<Category>;
  addedItems: Array<Item>;
  unaddedItems: Array<Item>;
}

export const ListContext = createContext<List>({
  isLoading: true,
  categories: [],
  addedItems: [],
  unaddedItems: [],
});

interface ListContextProviderProps {
  children: React.ReactNode;
}

export const ListContextProvider = ({ children }: ListContextProviderProps) => {
  const { firestore } = useFirebase();
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

  return (
    <ListContext.Provider
      value={{ isLoading, categories, addedItems, unaddedItems }}
    >
      {children}
    </ListContext.Provider>
  );
};
