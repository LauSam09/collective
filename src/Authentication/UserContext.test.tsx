import { screen, render } from "@testing-library/react"
import renderer from "react-test-renderer"
import { AuthContext } from "./AuthContext"

import { UserProvider } from "./UserContext"

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
})
