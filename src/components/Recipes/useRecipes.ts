import { useContext, useEffect, useState } from "react"
import firebase from "firebase"

import { Recipe } from "models"
import { AuthenticationContext } from "authentication/AuthenticationContext"

export default function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const { group } = useContext(AuthenticationContext)

  useEffect(() => {
    if (group) {
      const db = firebase.firestore()
      db.collection("groups")
        .doc(group.id)
        .collection("recipes")
        .get()
        .then((querySnapshot) => {
          setRecipes(
            querySnapshot.docs.map(
              (doc) => ({ ...doc.data(), id: doc.id } as Recipe)
            )
          )
        })
    } else {
      setRecipes([])
    }
  }, [group])

  return { recipes }
}
