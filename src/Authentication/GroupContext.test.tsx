import { render, screen } from "@testing-library/react"

import { GroupProvider } from "./GroupContext"

describe("GroupContext", () => {
  test("renders", () => {
    render(<GroupProvider />)
  })

  test("renders progress bar whilst determining if user is registered", () => {
    render(<GroupProvider />)

    expect(screen.getByRole("progressbar")).toBeInTheDocument()
  })
})
