import { useEffect, useState } from "react"

import { Item } from "./models"
import { useGroup } from "Authentication"
import { db } from "Config"

export function useItemSubscription() {
  const { defaultList, id } = useGroup() || {}
  const [items, setItems] = useState<Item[]>([])
  const [addedItems, setAddedItems] = useState<Item[]>([])
  const [unaddedItems, setUnaddedItems] = useState<Item[]>([])

  if (!defaultList || !id) {
    throw new Error("Group not defined for user.")
  }

  useEffect(() => {
    setAddedItems(items.filter((i) => i.added))
    setUnaddedItems(items.filter((i) => !i.added))
  }, [items])

  useEffect(() => {
    const unsubscribe = db
      .collection("groups")
      .doc(id)
      .collection("lists")
      .doc(defaultList)
      .collection("items")
      .onSnapshot((snapshot) => {
        const addedItems: Item[] = []
        snapshot.docChanges().forEach((change) => {
          const item = { ...change.doc.data(), id: change.doc.id } as Item
          switch (change.type) {
            case "added": {
              addedItems.push(item)
              break
            }
            case "modified": {
              setItems((old) => old.map((i) => (i.id === item.id ? item : i)))
              break
            }
            case "removed": {
              setItems((old) => old.filter((i) => i.id !== item.id))
              break
            }
          }
        })
        setItems((old) => [...old, ...addedItems])
      })

    return () => {
      unsubscribe()
    }
  }, [defaultList, id])

  return { addedItems, unaddedItems }
}
