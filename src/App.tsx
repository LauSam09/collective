import { useEffect } from "react"

import { Content, Footer, Header } from "Layout"

import classes from "./App.module.css"

export const App = () => {
  useEffect(() => {
    document.body.dataset.theme = "light"
  }, [])

  return (
    <div className={classes.app}>
      <Header />
      <Content />
      <Footer />
    </div>
  )
}
