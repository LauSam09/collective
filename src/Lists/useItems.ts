import firebase from "firebase/app"
import { singular } from "pluralize"

import { useUserContext } from "Authentication"
import { DatabaseItem } from "./models"

export function useItems() {
  const { getDefaultItemsCollection } = useUserContext()

  async function addItem(value: string, category?: string) {
    const itemsCollection = getDefaultItemsCollection()
    const name = value.trim()
    const lowerName = singular(name.toLowerCase())

    const existing = await itemsCollection
      .where("lowerName", "==", lowerName)
      .limit(1)
      .get()

    const fieldsToUpdate: Partial<DatabaseItem> = {
      name,
      added: true,
      completed: false,
      notes: "",
      // If undefined, then use existing category or "", otherwise use parameter category.
      category:
        category === undefined
          ? existing.docs?.[0]?.data().category || ""
          : category,
    }

    if (existing.empty) {
      await itemsCollection.add({ ...fieldsToUpdate, lowerName, count: 1 })
    } else {
      await itemsCollection.doc(existing.docs[0].id).update({
        ...fieldsToUpdate,
        count: (existing.docs[0].data().count ?? 0) + 1,
      })
    }
  }

  function deleteItem(id: string) {
    return getDefaultItemsCollection().doc(id).delete()
  }

  function removeItem(id: string) {
    return getDefaultItemsCollection().doc(id).update({
      completed: false,
      added: false,
      notes: firebase.firestore.FieldValue.delete(),
    })
  }

  function updateItem(id: string, item: Partial<DatabaseItem>) {
    return getDefaultItemsCollection().doc(id).update(item)
  }

  return { addItem, deleteItem, removeItem, updateItem }
}
