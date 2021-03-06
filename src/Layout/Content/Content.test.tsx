import { render } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"

import Content from "."

describe("<Content />", () => {
  test("renders", () => {
    render(
      <BrowserRouter>
        <Content />
      </BrowserRouter>
    )
  })
})
