import { render } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"

import { Content } from "./Content"

describe("<Content />", () => {
  test("renders", () => {
    render(
      <BrowserRouter>
        <Content />
      </BrowserRouter>
    )
  })
})
