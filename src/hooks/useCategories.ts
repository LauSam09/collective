import { useContext, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import firebase from "firebase/app"

import { AuthenticationContext } from "authentication/AuthenticationContext"
import { getCategories, ListCategory } from "store"

export default function useList() {
  const db = firebase.firestore()
  const dispatch = useDispatch()
  const [categoriesLoaded, setCategoriesLoaded] = useState(false)
  const { group } = useContext(AuthenticationContext)

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

  return {
    categoriesLoaded,
  }
}
