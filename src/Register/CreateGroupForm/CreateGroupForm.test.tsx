import { act, fireEvent, render, screen } from "@testing-library/react"
import { UserContext } from "Authentication"

import { CreateGroupForm } from "./CreateGroupForm"

jest.mock("./CreateGroupForm.service", () => {})

const renderFormWithContext = () =>
  render(
    <UserContext.Provider value={{ user: { id: "1" } }}>
      <CreateGroupForm />
    </UserContext.Provider>
  )

describe("<CreateGroupForm />", () => {
  test("renders", async () => {
    await act(async () => {
      renderFormWithContext()
    })
  })

  test("renders input field", async () => {
    await act(async () => {
      renderFormWithContext()
    })

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
  })

  test("submit button is disabled if name is empty", async () => {
    await act(async () => {
      renderFormWithContext()
    })

    const nameInput = screen.getByLabelText(/name/i)
    expect(nameInput).toHaveTextContent("")

    const button = screen.getByText("Create")
    expect(button).toHaveAttribute("disabled")
  })

  test("submit button is enabled if name is given", async () => {
    await act(async () => {
      renderFormWithContext()
    })

    const nameInput = screen.getByLabelText(/name/i)
    await act(async () => {
      fireEvent.input(nameInput, { target: { value: "The Ragdoll" } })
    })

    const button = screen.getByText("Create")
    expect(button).not.toHaveAttribute("disabled")
  })

  test("displays validation message if name is added and removed", async () => {
    await act(async () => {
      renderFormWithContext()
    })

    const nameInput = screen.getByLabelText(/name/i)
    await act(async () => {
      fireEvent.input(nameInput, { target: { value: "The Ragdoll" } })
    })

    await act(async () => {
      fireEvent.input(nameInput, { target: { value: "" } })
    })

    expect(screen.getByText(/you must provide a name/i)).toBeInTheDocument()
  })
})
