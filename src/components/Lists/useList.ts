import { useCallback, useContext, useEffect, useState } from "react"
import firebase from "firebase"

import { Item } from "models"
import { AuthenticationContext } from "authentication/AuthenticationContext"

export default function useList() {
  const [items, setItems] = useState<Item[]>([])
  const { group } = useContext(AuthenticationContext)

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
            case "added":
              setItems((items) => [
                ...items,
                { ...change.doc.data(), id: change.doc.id } as Item, // TODO I think can cast type in firestore api
              ])
              break
            case "removed": {
              setItems((items) =>
                items.filter((item) => item.id !== change.doc.id)
              )
              break
            }
          }
        })
      })

    return () => {
      unsubscribe()
    }
  }, [group])

  const addItem = async (item: Item) => {
    const db = firebase.firestore()

    await db
      .collection("groups")
      .doc(group?.id)
      .collection("lists")
      .doc(group?.defaultList)
      .collection("items")
      .add(item)
  }

  const deleteItem = async (id: string) => {
    const db = firebase.firestore()

    await db
      .collection("groups")
      .doc(group?.id)
      .collection("lists")
      .doc(group?.defaultList)
      .collection("items")
      .doc(id)
      .delete()
  }

  return { items, fetchItems, addItem, deleteItem }
}
