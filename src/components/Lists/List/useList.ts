import { useContext, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import firebase from "firebase"

import { Item, ItemEntity } from "models"
import { AuthenticationContext } from "authentication/AuthenticationContext"
import {
  ListItem,
  upsertItem,
  removeItem as removeItemAction,
  getCategories,
  ListCategory,
} from "store"

export default function useList() {
  const db = firebase.firestore()
  const dispatch = useDispatch()
  const [items, setItems] = useState<Item[]>([])
  const [categoriesLoaded, setCategoriesLoaded] = useState(false)
  const { group } = useContext(AuthenticationContext)

  const getItemsCollection = () => {
    return db
      .collection("groups")
      .doc(group?.id)
      .collection("lists")
      .doc(group?.defaultList)
      .collection("items")
  }

  useEffect(() => {
    if (group) {
      db.collection("groups")
        .doc(group.id)
        .collection("lists")
        .doc(group.defaultList)
        .collection("categories")
        .get()
        .then((querySnapshot) => {
          dispatch(
            getCategories(
              querySnapshot.docs.map(
                (doc) =>
                  ({
                    ...doc.data(),
                    id: doc.id,
                    listId: group.defaultList || "",
                  } as ListCategory)
              )
            )
          )
        })
        .then(() => setCategoriesLoaded(true))
    } else {
      dispatch(getCategories([]))
      setCategoriesLoaded(true)
    }
  }, [group, db, dispatch])

  useEffect(() => {
    const unsubscribe = db
      .collection("groups")
      .doc(group?.id)
      .collection("lists")
      .doc(group?.defaultList)
      .collection("items")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          switch (change.type) {
            case "added": {
              const addedItem = change.doc.data()
              const { added, ...rest } = addedItem
              added &&
                dispatch(
                  upsertItem({
                    ...rest,
                    id: change.doc.id,
                    listId: group?.defaultList || "",
                  } as ListItem)
                )
              break
            }

            case "modified": {
              const modifiedItem = change.doc.data()
              const { added, ...rest } = modifiedItem
              added
                ? dispatch(
                    upsertItem({
                      ...rest,
                      id: change.doc.id,
                      listId: group?.defaultList || "",
                    } as ListItem)
                  )
                : dispatch(
                    removeItemAction({
                      id: change.doc.id,
                      listId: group?.defaultList || "",
                    })
                  )
              break
            }
            case "removed":
              setItems((items) =>
                items.filter((item) => item.id !== change.doc.id)
              )
              break
          }
        })
      })

    return () => {
      unsubscribe()
    }
  }, [group, db, dispatch])

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
      await getItemsCollection().add({ ...itemEntity, added: true })
    } else {
      await getItemsCollection().doc(existing.docs[0].id).update({
        name: itemEntity.name,
        added: true,
        completed: false,
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

  const removeAll = async () => {
    const batch = db.batch()

    for (const item of items) {
      const ref = getItemsCollection().doc(item.id)
      batch.update(ref, { added: false })
    }

    await batch.commit()
  }

  const removeAllCompleted = async () => {
    const batch = db.batch()

    for (const item of items.filter((item) => item.completed)) {
      const ref = getItemsCollection().doc(item.id)
      batch.update(ref, { added: false })
    }

    await batch.commit()
  }

  const updateNotes = async (id: string, notes: string | undefined) => {
    await getItemsCollection()
      .doc(id)
      .update({
        notes:
          notes === undefined ? firebase.firestore.FieldValue.delete() : notes,
      })
  }

  const editItem = async (item: Item) => {
    const { id, ...sanitisedItem } = item

    await getItemsCollection().doc(id).update(sanitisedItem)
  }

  return {
    categoriesLoaded,
    addItem,
    deleteItem,
    removeItem,
    removeAll,
    removeAllCompleted,
    setCompletionStatus,
    setCategory,
    updateNotes,
    editItem,
  }
}
