import React, { useContext } from 'react'

import { AuthenticationContext } from './authentication/AuthenticationContext'
import './App.css'
import { UserState } from './models'

function App() {
  const { authenticated, login, logout, userState } = useContext(AuthenticationContext)

  return (
    <div className="App">
      <header className="App-header">
        <p>Collective</p>
        {authenticated ? <button onClick={logout}>Log out</button> : <button onClick={login}>Log in</button>}
        {userState === UserState.Registered && <p>Welcome back</p>}
        {userState === UserState.Unregistered && <p>Create a group.</p>}
        {userState === UserState.New && <p>Welcome to Collective!</p>}
      </header>
    </div>
  )
}

export default App
