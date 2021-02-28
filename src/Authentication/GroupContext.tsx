import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import firebase from "firebase/app"
import "firebase/firestore"

import { User, UserGroup } from "./models"
import { useUser } from "./UserContext"
import { FullPageSpinner } from "Common"

type GroupContextType = {
  group: UserGroup | undefined
  isRegistered: boolean
  setGroup: (group: UserGroup) => void
}

const GroupContext = createContext<Partial<GroupContextType>>({})

type GroupProviderProps = {
  children?: ReactNode
}

const db = firebase.firestore()

function GroupProvider(props: GroupProviderProps) {
  const user = useUser()
  const [group, setGroup] = useState<UserGroup>()
  const [isRegistered, setIsRegistered] = useState<boolean>()

  useEffect(() => {
    if (user) {
      db.collection("users")
        .doc(user.id)
        .get()
        .then((doc) => {
          const dbUser = doc.data() as User
          setIsRegistered(!!dbUser.group)
          !group && setGroup(dbUser?.group)
        })
    }
  }, [user, group])

  if (isRegistered === undefined) {
    return <FullPageSpinner />
  }

  return (
    <GroupContext.Provider
      value={{
        group,
        setGroup,
        isRegistered,
      }}
      {...props}
    />
  )
}

const useGroup = () => useContext(GroupContext).group
const useGroupContext = () => useContext(GroupContext)
const useIsRegistered = () => useGroupContext().isRegistered

export { GroupProvider, useGroup, useGroupContext, useIsRegistered }
