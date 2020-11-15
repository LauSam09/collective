import { useCallback, useContext, useEffect, useState } from "react"
import firebase from "firebase"

import { Category, Item, ItemEntity } from "models"
import { AuthenticationContext } from "authentication/AuthenticationContext"

export default function useList() {
  const db = firebase.firestore()
  const [items, setItems] = useState<Item[]>([])
  const [categories, setCategories] = useState<Category[]>([])
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

  const fetchItems = useCallback(async () => {
    const querySnapshot = await db
      .collection("groups")
      .doc(group?.id)
      .collection("lists")
      .doc(group?.defaultList)
      .collection("items")
      .get()

    const itemsToSet: Item[] = []
    querySnapshot.forEach((item) =>
      itemsToSet.push({ ...item.data(), id: item.id } as Item)
    )

    setItems(itemsToSet)
  }, [group, db])

  useEffect(() => {
    if (group) {
      db.collection("groups")
        .doc(group.id)
        .collection("lists")
        .doc(group.defaultList)
        .collection("categories")
        .get()
        .then((querySnapshot) => {
          setCategories(
            querySnapshot.docs.map(
              (doc) => ({ ...doc.data(), id: doc.id } as Category)
            )
          )
        })
        .then(() => setCategoriesLoaded(true))
    } else {
      setCategories([])
      setCategoriesLoaded(true)
    }
  }, [group, db])

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
                setItems((items) => [
                  ...items,
                  { ...rest, id: change.doc.id } as Item, // TODO I think can cast type in firestore api
                ])
              break
            }

            case "modified": {
              const modifiedItem = change.doc.data()
              const { added, ...rest } = modifiedItem
              added
                ? setItems((items) =>
                    items.filter((item) => item.id === change.doc.id).length ===
                    0
                      ? [...items, { ...rest, id: change.doc.id } as Item]
                      : items.map((item) =>
                          item.id === change.doc.id
                            ? ({ ...rest, id: change.doc.id } as Item)
                            : { ...item }
                        )
                  )
                : setItems((items) =>
                    items.filter((item) => item.id !== change.doc.id)
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
  }, [group, db])

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
      category: category,
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

  return {
    categoriesLoaded,
    items,
    categories,
    fetchItems,
    addItem,
    deleteItem,
    removeItem,
    removeAll,
    removeAllCompleted,
    setCompletionStatus,
    setCategory,
    updateNotes,
  }
}
