import { useContext } from "react"
import { singular } from "pluralize"
import { useSelector } from "react-redux"
import firebase from "firebase/app"

import { RootState } from "store"
import { AuthenticationContext } from "authentication/AuthenticationContext"
import { Item, ItemEntity } from "models"

export default function useItems() {
  const db = firebase.firestore()
  const items = useSelector((state: RootState) => state.listState.items)
  const { group } = useContext(AuthenticationContext)

  const getItemsCollection = () => {
    return db
      .collection("groups")
      .doc(group?.id)
      .collection("lists")
      .doc(group?.defaultList)
      .collection("items")
  }

  function getMatchingItem(name: string) {
    if (!name.trim()) {
      return undefined
    }

    const sanitisedName = singular(name.trim().toLowerCase())

    return items.find(
      (item) => singular(item.name.trim().toLowerCase()) === sanitisedName
    )
  }

  const addItem = async (item: Item) => {
    const { id, ...sanitisedItem } = item
    const itemEntity: ItemEntity = {
      ...sanitisedItem,
      name: sanitisedItem.name.trim(),
      lowerName: sanitisedItem.name.trim().toLowerCase(),
    }

    const existing = await getItemsCollection()
      .where("lowerName", "==", itemEntity.lowerName)
      .limit(1)
      .get()

    if (existing.empty) {
      await getItemsCollection().add({
        ...itemEntity,
        added: true,
        count: 1,
      })
    } else {
      await getItemsCollection()
        .doc(existing.docs[0].id)
        .update({
          name: itemEntity.name,
          added: true,
          completed: false,
          count: (existing.docs[0].data().count ?? 0) + 1,
        })
    }
  }

  const deleteItem = async (id: string) => {
    await getItemsCollection().doc(id).delete()
  }

  const setCompletionStatus = async (id: string, status: boolean) => {
    await getItemsCollection().doc(id).update({
      completed: status,
    })
  }

  const setCategory = async (id: string, category?: string) => {
    await getItemsCollection().doc(id).update({
      category,
    })
  }

  const removeItem = async (id: string) => {
    await getItemsCollection().doc(id).update({
      added: false,
      notes: firebase.firestore.FieldValue.delete(),
    })
  }

  const removeAllCompleted = async () => {
    const batch = db.batch()

    for (const item of items.filter((item) => item.completed)) {
      const ref = getItemsCollection().doc(item.id)
      batch.update(ref, { added: false })
    }

    await batch.commit()
  }

  const editItem = async (item: Item) => {
    const { id, ...sanitisedItem } = item

    await getItemsCollection().doc(id).update(sanitisedItem)
  }

  return {
    getMatchingItem,
    addItem,
    deleteItem,
    removeItem,
    removeAllCompleted,
    setCompletionStatus,
    setCategory,
    editItem,
  }
}
