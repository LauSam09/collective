import firebase from "firebase/app"
import { singular } from "pluralize"

import { useUserContext } from "Authentication"
import { DatabaseItem } from "./models"

import { db } from "Config"

export function useItems() {
  const { getDefaultItemsCollection } = useUserContext()
  const collection = getDefaultItemsCollection()

  async function addItem(value: string, category?: string) {
    const name = value.trim()
    const lowerName = singular(name.toLowerCase())

    const existing = await collection
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
      await collection.add({ ...fieldsToUpdate, lowerName, count: 1 })
    } else {
      await collection.doc(existing.docs[0].id).update({
        ...fieldsToUpdate,
        count: (existing.docs[0].data().count ?? 0) + 1,
      })
    }
  }

  function deleteItem(id: string) {
    return collection.doc(id).delete()
  }

  function removeItem(id: string) {
    return collection.doc(id).update({
      completed: false,
      added: false,
      notes: firebase.firestore.FieldValue.delete(),
    })
  }

  function updateItem(id: string, item: Partial<DatabaseItem>) {
    return collection.doc(id).update(item)
  }

  function batchRemoveItems(ids: string[]) {
    const batch = db.batch()

    for (const id of ids) {
      const ref = collection.doc(id)
      batch.update(ref, {
        completed: false,
        added: false,
        notes: firebase.firestore.FieldValue.delete(),
      })
    }

    return batch.commit()
  }

  return { addItem, batchRemoveItems, deleteItem, removeItem, updateItem }
}
