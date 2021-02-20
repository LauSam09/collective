import { render, screen } from "@testing-library/react"
import Header from "."

describe("<Header />", () => {
  test("renders name of application", () => {
    render(<Header />)

    expect(screen.getByText(/Collective/i)).toBeInTheDocument()
  })
})
