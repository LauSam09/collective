import { AddIcon } from "@chakra-ui/icons"
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react"
import { createRef, FormEvent } from "react"
import { OptionsOrGroups, GroupBase } from "react-select"
import AsyncSelect from "react-select/async-creatable"
import ReactSelect from "react-select/dist/declarations/src/Select"

export type LoadOptionsCallback = (
  options: OptionsOrGroups<
    {
      label: string
      value: string
    },
    GroupBase<{
      label: string
      value: string
    }>
  >
) => void

export type SelectRef = ReactSelect<
  { label: string; value: string },
  false,
  GroupBase<{ label: string; value: string }>
>

export const AddItem = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const inputRef = createRef<SelectRef>()

  if (!isOpen) {
    return (
      <Button
        variant="solid"
        size="lg"
        position="fixed"
        colorScheme={"blue"}
        bottom="4"
        right="4"
        zIndex={10}
        onClick={() => onOpen()}
      >
        <AddIcon />
      </Button>
    )
  }

  const inMemoryOptions = [
    { name: "cabbage", label: "cabbage", value: "cabbage", category: "" },
    { name: "crisps", label: "crisps", value: "crisps", category: "" },
    {
      name: "hash browns",
      label: "hash browns",
      value: "hash browns",
      category: "",
    },
    { name: "potatoes", label: "potatoes", value: "potatoes", category: "" },
  ]

  const loadOptions = (inputValue: string, callback: LoadOptionsCallback) =>
    callback(
      inMemoryOptions.filter((o) =>
        o.name.toLowerCase().includes(inputValue.toLowerCase())
      )
    )

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const value = (e.currentTarget.elements[1] as HTMLInputElement).value

    inputRef.current?.clearValue()
    inputRef.current?.focus()

    console.log(value)
  }

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      size="3xl"
      blockScrollOnMount={false}
    >
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Add Item</ModalHeader>
          <ModalBody>
            {/* TODO: fix dark mode styling */}
            <AsyncSelect
              name="item"
              isClearable
              loadOptions={loadOptions}
              ref={inputRef}
            />
            {/* 
              TODO: Highlight category of selected item but don't bother
              with category selection for new items - these can be edited
             */}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} type="submit">
              Add
            </Button>
            <Button variant="ghost" onClick={onClose} type="button">
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
