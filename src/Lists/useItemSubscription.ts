import { useEffect, useState } from "react"

import { useUserContext } from "Authentication"

import { Item } from "./models"

export function useItemSubscription() {
  const { getDefaultItemsCollection } = useUserContext()
  const [items, setItems] = useState<Item[]>([])
  const [addedItems, setAddedItems] = useState<Item[]>([])
  const [unaddedItems, setUnaddedItems] = useState<Item[]>([])

  useEffect(() => {
    setAddedItems(items.filter((i) => i.added))
    setUnaddedItems(items.filter((i) => !i.added))
  }, [items])

  useEffect(() => {
    const unsubscribe = getDefaultItemsCollection().onSnapshot((snapshot) => {
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
  }, [getDefaultItemsCollection])

  return { addedItems, unaddedItems }
}
