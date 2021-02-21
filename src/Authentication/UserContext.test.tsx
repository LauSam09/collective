import { screen, render } from "@testing-library/react"
import renderer from "react-test-renderer"
import { AuthContext } from "./AuthContext"

import { UserProvider, useIsAuthenticated } from "./UserContext"

function TestUseIsAuthenticated() {
  return useIsAuthenticated() ? <>Authenticated</> : <>Unauthenticated</>
}

describe("UserContext", () => {
  describe("UserProvider", () => {
    test("renders", () => {
      render(<UserProvider />)
    })

    test("renders children", () => {
      const json = renderer
        .create(
          <UserProvider>
            <span>test</span>
          </UserProvider>
        )
        .toJSON()

      expect(json).toMatchInlineSnapshot(`
        <span>
          test
        </span>
      `)
    })
  })

  describe("useIsAuthenticated", () => {
    test("returns false if unauthenticated", () => {
      render(
        <AuthContext.Provider value={{ user: undefined }}>
          <UserProvider>
            <TestUseIsAuthenticated />
          </UserProvider>
        </AuthContext.Provider>
      )

      expect(screen.getByText(/Unauthenticated/)).toBeInTheDocument()
    })

    test("returns true if authenticated", () => {
      render(
        <AuthContext.Provider value={{ user: { firstName: "John" } }}>
          <UserProvider>
            <TestUseIsAuthenticated />
          </UserProvider>
        </AuthContext.Provider>
      )

      expect(screen.getByText(/Authenticated/)).toBeInTheDocument()
    })
  })
})
