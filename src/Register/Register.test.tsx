import { act, render, screen } from "@testing-library/react"

import Register from "./Register"
import { UserContext } from "Authentication"

jest.mock("./CreateGroupForm/CreateGroupForm.service", () => {})

describe("<Register />", () => {
  test("renders welcome message", async () => {
    await act(async () => {
      render(
        <UserContext.Provider
          value={{
            user: { displayName: "John Falstaff", id: "1" },
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
