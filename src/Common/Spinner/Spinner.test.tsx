import { screen, render } from "@testing-library/react"
import { Spinner } from "./Spinner"

describe("<Spinner />", () => {
  test("renders progressbar", () => {
    render(<Spinner />)

    expect(screen.getByRole("progressbar")).toBeInTheDocument()
  })
})
