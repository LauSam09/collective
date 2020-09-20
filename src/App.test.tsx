import React from "react"
import { render } from "@testing-library/react"
import App from "./App"

test("renders heading", () => {
  const { getByText } = render(<App />)
  const headingElement = getByText(/collective/i)
  expect(headingElement).toBeInTheDocument()
})
