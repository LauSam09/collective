import React, { useContext, useEffect, useState } from 'react'
import firebase, { firestore } from 'firebase'

import { AuthenticationContext } from './authentication/AuthenticationContext'
import './App.css'

function App() {
  const [docs, setDocs] = useState<firestore.DocumentData[]>([])
  const { initialised, authenticated, login, logout } = useContext(AuthenticationContext)

  useEffect(() => {
    if (!authenticated) {
      return
    }

    const db = firebase.firestore()

    db.collection('users').get().then((querySnapshot) =>
      setDocs(querySnapshot.docs)
    )
  }, [authenticated])

  return (
    <div className="App">
      <header className="App-header">
        <p>Collective</p>
        <p>Initialised: {String(initialised)}</p>
        <p>Authenticated: {String(authenticated)}</p>
        {authenticated ? <button onClick={logout}>Log out</button> : <button onClick={login}>Log in</button>}
        {authenticated && <p>Users in database: {docs.length}</p>}
      </header>
    </div>
  )
}

export default App
