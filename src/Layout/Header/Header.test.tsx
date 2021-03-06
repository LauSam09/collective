import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import renderer from "react-test-renderer"

import { Header } from "./Header"

function TestHeader() {
  return (
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  )
}

describe("<Header />", () => {
  test("matches snapshot", () => {
    const json = renderer.create(<TestHeader />).toJSON()
    expect(json).toMatchSnapshot()
  })

  test("renders name of application", () => {
    render(<TestHeader />)
    expect(screen.getByText(/collective/i)).toBeInTheDocument()
  })

  test("renders banner", () => {
    render(<TestHeader />)
    expect(screen.getByRole(/banner/i)).toBeInTheDocument()
  })

  test("renders nav", () => {
    render(<TestHeader />)
    expect(screen.getByRole(/nav/i)).toBeInTheDocument()
  })

  test("renders 'collective' as link to /", () => {
    render(<TestHeader />)

    const link = screen.getByRole(/link/i)
    expect(link).toBeInTheDocument()
    expect(link).toHaveTextContent(/collective/i)
  })
})
