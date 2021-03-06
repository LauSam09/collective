import { render, screen } from "@testing-library/react"
import renderer from "react-test-renderer"

import { Footer } from "./Footer"

describe("<Footer />", () => {
  test("matches snapshot", () => {
    const json = renderer.create(<Footer />).toJSON()
    expect(json).toMatchSnapshot()
  })

  test("renders contentinfo role", () => {
    render(<Footer />)
    expect(screen.getByRole(/contentinfo/i)).toBeInTheDocument()
  })

  test("renders copyright notice", () => {
    render(<Footer />)
    expect(
      screen.getByText(/© Copyright 2021, Collective/i)
    ).toBeInTheDocument()
  })
})
