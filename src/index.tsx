import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import Modal from "react-modal"

import { App } from "App"
import { AppProviders } from "./AppProviders"
import * as serviceWorkerRegistration from "./serviceWorkerRegistration"
import { reportWebVitals } from "reportWebVitals"
import "index.css"

Modal.setAppElement("#root")

ReactDOM.render(
  <React.StrictMode>
    <AppProviders>
      <Router>
        <App />
      </Router>
    </AppProviders>
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
if (process.env.NODE_ENV === "development") {
  serviceWorkerRegistration.unregister()
} else {
  serviceWorkerRegistration.register()
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
