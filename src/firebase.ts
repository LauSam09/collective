import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  initializeFirestore,
  persistentLocalCache,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const firestore = initializeFirestore(app, {
  localCache: persistentLocalCache(),
});

interface FirestoreUser {
  group: {
    id: string;
    name: string;
    defaultList: string;
  };
}

export const getFirestoreUser = async (uid: string) => {
  const ref = doc(firestore, "users", uid);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    return;
  }

  return { ...(snapshot.data() as FirestoreUser), id: snapshot.id };
};

export interface Category {
  id: string;
  colour: string;
  name: string;
  order: number;
}

export const getCategories = async (groupId: string, listId: string) => {
  const snapshot = await getDocs(
    collection(firestore, "groups", groupId, "lists", listId, "categories"),
  );

  const categories: Array<Category> = [];

  snapshot.forEach((doc) => {
    categories.push({ ...(doc.data() as Category), id: doc.id });
  });

  return categories;
};

export interface Recipe {
  id: string;
  name: string;
  notes: string | undefined;
  recipeUrl: string | undefined;
  tags: Array<string>;
  ingredients: Array<string>;
  days?: Array<number>;
}

export const getAddedRecipes = async (groupId: string) => {
  const snapshot = await getDocs(
    query(
      collection(firestore, "groups", groupId, "recipes"),
      // TODO: Check if 0 or 1 indexed.
      where("days", "array-contains-any", [0, 1, 2, 3, 4, 5, 6, 7]),
    ),
  );

  const recipes: Array<Recipe> = [];

  snapshot.forEach((doc) => {
    recipes.push({ ...(doc.data() as Recipe), id: doc.id });
  });

  return recipes;
};

export const updateItemCompleted = async (
  groupId: string,
  listId: string,
  itemId: string,
  completed: boolean,
) => {
  const docRef = doc(
    firestore,
    "groups",
    groupId,
    "lists",
    listId,
    "items",
    itemId,
  );

  await updateDoc(docRef, {
    completed,
  });
};

export const addItem = (groupId: string, listId: string, itemId: string) => {
  const docRef = doc(
    firestore,
    "groups",
    groupId,
    "lists",
    listId,
    "items",
    itemId,
  );

  updateDoc(docRef, {
    added: true,
    // TODO: Increment count
    notes: "",
  });
};

export const removeItem = async (
  groupId: string,
  listId: string,
  itemId: string,
) => {
  const docRef = doc(
    firestore,
    "groups",
    groupId,
    "lists",
    listId,
    "items",
    itemId,
  );

  await updateDoc(docRef, {
    added: false,
    completed: false,
    // TODO: Decrement count
    notes: "",
  });
};

export const updateItem = async (
  groupId: string,
  listId: string,
  itemId: string,
  item: Partial<Item>,
) => {
  const docRef = doc(
    firestore,
    "groups",
    groupId,
    "lists",
    listId,
    "items",
    itemId,
  );

  await updateDoc(docRef, {
    ...item,
  });
};

export interface Item {
  id: string;
  added: boolean;
  category: string;
  completed: boolean;
  count: number;
  name: string;
  lowerName: string;
  notes: string;
}

export const fetchItems = async (groupId: string, listId: string) => {
  const snapshot = await getDocs(
    query(
      collection(firestore, "groups", groupId, "lists", listId),
      // TODO: Check if 0 or 1 indexed.
      where("days", "array-contains-any", [0, 1, 2, 3, 4, 5, 6, 7]),
    ),
  );

  const recipes: Array<Recipe> = [];

  snapshot.forEach((doc) => {
    recipes.push({ ...(doc.data() as Recipe), id: doc.id });
  });
};

export * from "firebase/auth";
