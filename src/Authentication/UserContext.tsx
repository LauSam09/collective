import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import firebase from "firebase/app"
import "firebase/firestore"

import { FullPageSpinner } from "Common"

import { useAuth } from "./AuthContext"
import { DatabaseUser, User, UserGroup, UserState } from "./models"

const db = firebase.firestore()

type UserContextType = {
  user: User | undefined
  setUserGroup: (group: UserGroup) => void
}

const UserContext = createContext<UserContextType>({
  user: undefined,
  setUserGroup: () => null,
})

type UserProviderProps = {
  children?: ReactNode
}

function UserProvider(props: UserProviderProps) {
  const authUser = useAuth().user
  const [user, setUser] = useState<User>()

  useEffect(() => {
    if (authUser) {
      // TODO handle error case
      db.collection("users")
        .doc(authUser.id)
        .get()
        .then((doc) => {
          const dbUser = doc.data() as DatabaseUser
          setUser({
            ...dbUser,
            id: authUser.id,
            displayName: authUser.displayName || dbUser.email,
          })
        })
    } else {
      setUser(undefined)
    }
  }, [authUser])

  /** Used to update the user once they have registered */
  const setUserGroup = (group: UserGroup) => {
    if (!user) {
      throw new Error("Should not try to set user group when user is undefined")
    }

    setUser({ ...user, state: UserState.Registered, group })
  }

  const fetching = authUser && !user

  if (fetching) {
    return <FullPageSpinner />
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUserGroup,
      }}
      {...props}
    />
  )
}

const useUserContext = () => useContext(UserContext)
const useUser = () => useUserContext().user
const useGroup = () => useUser()?.group
const useIsRegistered = () => useUser()?.state === UserState.Registered

export {
  UserContext,
  UserProvider,
  useUserContext,
  useUser,
  useGroup,
  useIsRegistered,
}
