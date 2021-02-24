import firebase from "firebase/app"
import "firebase/firestore"

import { Group } from "Authentication"
import { Category } from "Lists/models"

const db = firebase.firestore()

// For now hard-code the initial categories. These could be customisable in future.
const defaultCategories: Category[] = [
  {
    name: "Fruit & Vegetables",
    colour: "#74ac72",
    order: 0,
  },
  {
    name: "Meat",
    colour: "#ffb0b0",
    order: 1,
  },
  {
    name: "Fresh",
    colour: "#95d5b7",
    order: 2,
  },
  {
    name: "Pantry",
    colour: "#969B96",
    order: 3,
  },
  {
    name: "Drinks",
    colour: "#a4c7db",
    order: 4,
  },
  { name: "Eggs & Dairy", colour: "#fcf403", order: 5 },
  {
    name: "Health & Beauty",
    colour: "#ff99ff",
    order: 6,
  },
  {
    name: "Home",
    colour: "#487586",
    order: 7,
  },
  { name: "Frozen", colour: "#0384fc", order: 8 },
]

export async function createGroup(group: Group) {
  const groupDoc = await db.collection("groups").add(group)
  const listDoc = await groupDoc.collection("lists").add({ name: "shopping" })

  const batch = db.batch()

  defaultCategories.forEach((category) => {
    const categoryRef = listDoc.collection("categories").doc()
    batch.set(categoryRef, category)
  })

  await batch.commit()

  await db
    .collection("users")
    .doc(group.users[0])
    .update({
      group: {
        id: groupDoc.id,
        name: group.name,
        defaultList: listDoc.id,
      },
    })
}
