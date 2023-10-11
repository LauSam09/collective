import { useContext } from "react"
import { FirebaseContext } from "../contexts/FirebaseContext"

const useFirebase = () => {
  const firebase = useContext(FirebaseContext)
  if (!firebase) {
    throw new Error("Firebase context not found")
  }
  return firebase
}

export default useFirebase
