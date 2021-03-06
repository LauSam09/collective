import { render } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { RegisteredSplash } from "./RegisteredSplash"

describe("<RegisteredSplash />", () => {
  test("renders", () => {
    render(
      <BrowserRouter>
        <RegisteredSplash />
      </BrowserRouter>
    )
  })
})
