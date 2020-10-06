import { useCallback, useContext, useEffect, useState } from "react"
import firebase from "firebase"

import { Category, Item } from "models"
import { AuthenticationContext } from "authentication/AuthenticationContext"

export default function useList() {
  const [items, setItems] = useState<Item[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const { group } = useContext(AuthenticationContext)

  const getItemsCollection = (db = firebase.firestore()) => {
    return db
      .collection("groups")
      .doc(group?.id)
      .collection("lists")
      .doc(group?.defaultList)
      .collection("items")
  }

  const fetchItems = useCallback(async () => {
    const db = firebase.firestore()

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
  }, [group])

  useEffect(() => {
    if (group) {
      const db = firebase.firestore()
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
    } else {
      setCategories([])
    }
  }, [group])

  useEffect(() => {
    const db = firebase.firestore()

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
  }, [group])

  const addItem = async (item: Item) => {
    const { id, ...sanitisedItem } = item
    sanitisedItem.name = sanitisedItem.name.trim()

    const existing = await getItemsCollection()
      .where("name", "==", sanitisedItem.name)
      .limit(1)
      .get()

    if (existing.empty) {
      await getItemsCollection().add({ ...sanitisedItem, added: true })
    } else {
      await getItemsCollection().doc(existing.docs[0].id).update({
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
    })
  }

  const removeAll = async () => {
    const db = firebase.firestore()

    const batch = db.batch()

    for (const item of items) {
      const ref = getItemsCollection(db).doc(item.id)
      batch.update(ref, { added: false })
    }

    await batch.commit()
  }

  return {
    items,
    categories,
    fetchItems,
    addItem,
    deleteItem,
    removeItem,
    removeAll,
    setCompletionStatus,
    setCategory,
  }
}
