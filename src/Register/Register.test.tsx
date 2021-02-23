import { act, render, screen } from "@testing-library/react"

import Register from "./Register"
import { UserContext } from "Authentication"

describe("<Register />", () => {
  test("renders welcome message", async () => {
    await act(async () => {
      render(
        <UserContext.Provider
          value={{
            user: { displayName: "John Falstaff" },
          }}
        >
          <Register />
        </UserContext.Provider>
      )
    })

    expect(screen.getByRole(/article/)).toBeInTheDocument()
    expect(
      screen.getByText(/welcome to Collective, it looks like you're new here/i)
    ).toBeInTheDocument()
  })
})
