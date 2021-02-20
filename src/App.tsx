import { useEffect, useState } from "react"
import classes from "./App.module.css"

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") ?? "light")
  const nextTheme = theme === "light" ? "dark" : "light"

  useEffect(() => {
    document.body.dataset.theme = theme
  }, [theme])

  return (
    <>
      <div className={classes.app}>Collective</div>
      <button onClick={() => setTheme(nextTheme)}>
        Change to {nextTheme} mode
      </button>
    </>
  )
}

export default App
