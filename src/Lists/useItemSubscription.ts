import { useEffect, useState } from "react"

import { useUserContext } from "Authentication"

import { ItemModel } from "./models"

export function useItemSubscription() {
  const { getDefaultItemsCollection } = useUserContext()
  const [items, setItems] = useState<ItemModel[]>([])
  const [addedItems, setAddedItems] = useState<ItemModel[]>([])
  const [unaddedItems, setUnaddedItems] = useState<ItemModel[]>([])

  useEffect(() => {
    setAddedItems(items.filter((i) => i.added))
    setUnaddedItems(items.filter((i) => !i.added))
  }, [items])

  useEffect(() => {
    const unsubscribe = getDefaultItemsCollection().onSnapshot((snapshot) => {
      const addedItems: ItemModel[] = []
      snapshot.docChanges().forEach((change) => {
        const item = { ...change.doc.data(), id: change.doc.id } as ItemModel
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
