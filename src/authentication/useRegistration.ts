import firebase from 'firebase'
import { useEffect, useState } from 'react'
import { UserState } from '../models'

type Props = {
  authenticated: boolean
}

export default function useRegistration(props: Props) {
  const { authenticated } = props
  const [userState, setUserState] = useState<UserState>()

  async function getUserState() {
    const db = firebase.firestore()
    var user = firebase.auth().currentUser

    const doc = await db.collection('users').doc(user?.uid).get()

    if (doc.exists) {
      if ((doc.data() as any).group) {
        setUserState(UserState.Registered)
      } else {
        setUserState(UserState.Unregistered)
      }
    } else {
      await db.collection('users').doc(user?.uid).set({
        added: new Date()
      })
      setUserState(UserState.New)
    }
  }

  useEffect(() => {
    if (!authenticated) {
      setUserState(undefined)
      return
    }

    getUserState()
  }, [authenticated])

  return { userState }
}
