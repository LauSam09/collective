import { fireEvent, render, screen } from "@testing-library/react"
import { AuthContext } from "Authentication"
import { AnonymousSplash } from "./AnonymousSplash"

describe("<AnonymousSplash />", () => {
  test("renders article", () => {
    render(<AnonymousSplash />)

    expect(screen.getByRole(/article/)).toBeInTheDocument()
  })

  test("renders `welcome` message", () => {
    render(<AnonymousSplash />)
    const message = /Welcome to Collective/i

    expect(screen.getByText(message)).toBeInTheDocument()
  })

  test("renders login button", () => {
    render(<AnonymousSplash />)

    const button = screen.getByRole(/button/)
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent(/sign in through google/i)
  })

  test("clicking login button calls login", () => {
    const login = jest.fn()

    render(
      <AuthContext.Provider value={{ login }}>
        <AnonymousSplash />
      </AuthContext.Provider>
    )

    const button = screen.getByRole(/button/)
    fireEvent.click(button)

    expect(login).toHaveBeenCalled()
    expect(login).toHaveBeenCalledTimes(1)
  })
})
