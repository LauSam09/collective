import { render } from "@testing-library/react"
import renderer from "react-test-renderer"
import { AuthContext } from "./AuthContext"

import { UserProvider } from "./UserContext"

describe("UserContext", () => {
  describe("UserProvider", () => {
    test("renders", () => {
      render(<UserProvider />)
    })

    test("renders progress indiciator when application is not initialised", () => {
      const json = renderer
        .create(
          <AuthContext.Provider value={{ initialised: false }}>
            <UserProvider>
              <span>test</span>
            </UserProvider>
          </AuthContext.Provider>
        )
        .toJSON()

      expect(json).toMatchInlineSnapshot(`
        <div
          className="spinner fullPage"
          role="progressbar"
        />
      `)
    })

    test("renders children when application is initialised", () => {
      const json = renderer
        .create(
          <AuthContext.Provider value={{ initialised: true }}>
            <UserProvider>
              <span>test</span>
            </UserProvider>
          </AuthContext.Provider>
        )
        .toJSON()

      expect(json).toMatchInlineSnapshot(`
        <span>
          test
        </span>
      `)
    })
  })
})
