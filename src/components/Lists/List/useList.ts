import { useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import firebase from "firebase/app"

import { Item, ItemEntity } from "models"
import { AuthenticationContext } from "authentication/AuthenticationContext"
import {
  ListItem,
  upsertItem,
  removeItem as removeItemAction,
  getCategories,
  ListCategory,
  RootState,
} from "store"

export default function useList() {
  const db = firebase.firestore()
  const dispatch = useDispatch()
  const items = useSelector((state: RootState) => state.listState.items)
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
              removeItemAction({
                id: change.doc.id,
                listId: group?.defaultList || "",
              })
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
    categoriesLoaded,
    addItem,
    deleteItem,
    removeItem,
    removeAllCompleted,
    setCompletionStatus,
    setCategory,
    editItem,
  }
}
