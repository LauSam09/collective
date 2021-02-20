import { useEffect } from "react"
import classes from "./App.module.css"

function App() {
  useEffect(() => {
    document.body.dataset.theme = "light"
  })

  return <div className={classes.app}>Collective</div>
}

export default App
