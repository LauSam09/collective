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
import { AuthUser, DatabaseUser, User, UserGroup, UserState } from "./models"

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

  /** Retrieves the user, or if it is their first login then create a new user object. */
  async function getOrCreateUser(authUser: AuthUser): Promise<DatabaseUser> {
    const doc = await db.collection("users").doc(authUser.id).get()

    if (doc.exists) {
      return doc.data() as DatabaseUser
    }

    const newUser: DatabaseUser = {
      name: authUser.displayName || authUser.email || "",
      added: firebase.firestore.FieldValue.serverTimestamp(),
      email: authUser.email,
      state: UserState.Unregistered,
    }
    await db.collection("users").doc(authUser.id).set(newUser)

    return newUser
  }

  useEffect(() => {
    if (authUser) {
      // TODO handle error case
      getOrCreateUser(authUser).then((dbUser) =>
        setUser({
          ...dbUser,
          id: authUser.id,
          displayName: authUser.displayName || dbUser.email,
        })
      )
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
