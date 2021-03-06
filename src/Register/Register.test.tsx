import { act, render, screen } from "@testing-library/react"

import { Register } from "./Register"
import { UserContext, UserState } from "Authentication"

jest.mock("./CreateGroupForm/CreateGroupForm.service", () => {})

describe("<Register />", () => {
  test("renders welcome message", async () => {
    await act(async () => {
      render(
        <UserContext.Provider
          value={{
            user: {
              name: "John Falstaff",
              id: "1",
              state: UserState.Unregistered,
            },
            setUserGroup: () => null,
            refreshUser: () => Promise.resolve(),
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
