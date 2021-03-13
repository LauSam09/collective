import { useEffect, useState } from "react"

import { Item } from "./models"
import { useGroup } from "Authentication"
import { db } from "Config"

export function useAddedItems() {
  const { defaultList, id } = useGroup() || {}
  const [addedItems, setAddedItems] = useState<Item[]>([])

  if (!defaultList || !id) {
    throw new Error("Group not defined for user.")
  }

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
          const { added, ...rest } = change.doc.data()
          switch (change.type) {
            case "added": {
              added &&
                addedItems.push({
                  ...rest,
                  id: change.doc.id,
                } as Item)
              break
            }
            case "modified": {
              if (added) {
                setAddedItems((old) =>
                  old.map((i) =>
                    i.id === change.doc.id
                      ? ({ ...rest, id: change.doc.id } as Item)
                      : i
                  )
                )
              } else {
                setAddedItems((old) =>
                  old.filter((i) => i.id !== change.doc.id)
                )
              }
              break
            }
          }
        })
        setAddedItems((old) => [...old, ...addedItems])
      })

    return () => {
      unsubscribe()
    }
  }, [defaultList, id])

  return { addedItems }
}

const fakeItems = [
  {
    name: "Spinach",
    lowerName: "spinach",
    category: "1",
    count: 2,
    notes: "Young leaf",
    added: true,
    completed: false,
  },
  {
    name: "Lemons",
    lowerName: "lemons",
    category: "1",
    count: 1,
    notes: "x3",
    added: true,
    completed: true,
  },
  {
    name: "Eggs",
    lowerName: "eggs",
    category: "2",
    count: 2,
    notes: undefined,
    added: true,
    completed: true,
  },
  {
    name: "Chocolate",
    lowerName: "chocolate",
    category: "",
    count: 2,
    notes: undefined,
    added: true,
    completed: true,
  },
  {
    name: "Frozen peas",
    lowerName: "frozen peas",
    category: "3",
    count: 3,
    notes: "Fischer",
    added: true,
    completed: false,
  },
]
