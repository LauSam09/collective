import { render, screen } from "@testing-library/react"
import Header from "."

describe("<Header />", () => {
  test("renders name of application", () => {
    render(<Header />)
    expect(screen.getByText(/collective/i)).toBeInTheDocument()
  })

  test("renders banner", () => {
    render(<Header />)
    expect(screen.getByRole(/banner/i)).toBeInTheDocument()
  })

  test("renders nav", () => {
    render(<Header />)
    expect(screen.getByRole(/nav/i)).toBeInTheDocument()
  })

  test("renders 'collective' as link to /", () => {
    render(<Header />)

    const link = screen.getByRole(/link/i)
    expect(link).toBeInTheDocument()
    expect(link).toHaveTextContent(/collective/i)
  })
})
