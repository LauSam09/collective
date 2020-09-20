import { useContext, useEffect, useState } from "react"
import firebase from "firebase"

import { Item } from "models"
import { AuthenticationContext } from "authentication/AuthenticationContext"

export default function useList() {
  const [items, setItems] = useState<Item[]>([])
  const { group } = useContext(AuthenticationContext)

  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
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
  }

  return { items }
}
