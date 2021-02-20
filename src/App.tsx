import { useEffect } from "react"

import { Header } from "./Layout"
import classes from "./App.module.css"

function App() {
  useEffect(() => {
    document.body.dataset.theme = "light"
  })

  return (
    <div className={classes.app}>
      <Header />
    </div>
  )
}

export default App
