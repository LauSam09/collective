import firebase from 'firebase'
import { useEffect, useState } from 'react'

import { Group, User, UserState } from '../models'

type Props = {
  authenticated: boolean
}

export default function useRegistration(props: Props) {
  const { authenticated } = props
  const [userState, setUserState] = useState<UserState>()
  const [group, setGroup] = useState<Group>()

  async function getUserState() {
    const db = firebase.firestore()
    var user = firebase.auth().currentUser

    if (!user) {
      throw Error('Authenticated user not found')
    }

    const doc = await db.collection('users').doc(user.uid).get()

    if (doc.exists) {
      const group = (doc.data() as User).group
      if (group) {
        setGroup(group)
        setUserState(UserState.Registered)
      } else {
        setUserState(UserState.Unregistered)
      }
    } else {
      await db.collection('users').doc(user?.uid).set({
        added: firebase.firestore.FieldValue.serverTimestamp()
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

  async function register(group: Group) {
    const db = firebase.firestore()
    var user = firebase.auth().currentUser

    if (!user) {
      throw Error('Authenticated user not found')
    }

    const groupDoc = await db.collection('groups').add({
      ...group,
      users: [user.uid]
    })
    group.id = groupDoc.id
    await db.collection('users').doc(user.uid).update({
      group
    })
    setGroup(group)
    setUserState(UserState.Registered)
  }

  return { userState, register, group }
}
