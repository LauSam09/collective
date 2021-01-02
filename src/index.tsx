import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import Modal from "react-modal"
import LogRocket from "logrocket"

import App from "./App"
import * as serviceWorker from "./serviceWorker"
import { AuthenticationContextProvider } from "./authentication"
import store from "store"

import "./index.css"

Modal.setAppElement("#root")

if (process.env.NODE_ENV === "production") {
  LogRocket.init("a0rvdh/collective")
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthenticationContextProvider>
        <App />
      </AuthenticationContextProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
