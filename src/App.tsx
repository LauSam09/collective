import React, { useContext } from 'react'

import { AuthenticationContext } from './authentication/AuthenticationContext'
import { UserState } from './models'

import './App.css'
import Register from './components/Register'

function App() {
  const { authenticated, login, logout, userState, group } = useContext(AuthenticationContext)

  return (
    <div className="App">
      <header className="App-header">
        <p>Collective</p>
        {authenticated ? <button onClick={logout}>Log out</button> : <button onClick={login}>Log in</button>}
        {userState === UserState.Registered && <p>Welcome back [{group?.name}]</p>}
        {userState === UserState.Unregistered && <Register />}
        {userState === UserState.New && <p>Welcome to Collective!</p>}
      </header>
    </div>
  )
}

export default App
