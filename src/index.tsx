import React from "react"
import ReactDOM from "react-dom"
import Modal from "react-modal"
import LogRocket from "logrocket"

import "./index.css"
import App from "./App"
import * as serviceWorker from "./serviceWorker"
import { AuthenticationContextProvider } from "./authentication/AuthenticationContext"

Modal.setAppElement("#root")

LogRocket.init("a0rvdh/collective")

ReactDOM.render(
  <React.StrictMode>
    <AuthenticationContextProvider>
      <App />
    </AuthenticationContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
