import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons"
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  useDisclosure,
} from "@chakra-ui/react"
import { createRef, FormEvent, useState } from "react"
import { OptionsOrGroups, GroupBase, SingleValue } from "react-select"
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
  >,
) => void

const DropdownIndicator = () => (
  <ChevronDownIcon width="20px" height="20px" mx="8px" />
)

export type SelectRef = ReactSelect<
  { label: string; value: string },
  false,
  GroupBase<{ label: string; value: string }>
>

export const AddItem = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const inputRef = createRef<SelectRef>()
  const [category, setCategory] = useState<string>()

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
    { name: "cabbage", label: "cabbage", value: "cabbage", category: "1" },
    { name: "crisps", label: "crisps", value: "crisps", category: "2" },
    {
      name: "hash browns",
      label: "hash browns",
      value: "hash browns",
      category: "3",
    },
    { name: "potatoes", label: "potatoes", value: "potatoes", category: "1" },
  ]

  const loadOptions = (inputValue: string, callback: LoadOptionsCallback) =>
    callback(
      inMemoryOptions.filter((o) =>
        o.name.toLowerCase().includes(inputValue.toLowerCase()),
      ),
    )

  const handleChange = (
    value: SingleValue<{
      label: string
      value: string
    }>,
  ) => {
    const item = inMemoryOptions.find((o) => o.value === value?.value)

    if (item) {
      setCategory(item.category)
    } else {
      setCategory(undefined)
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const value = (e.currentTarget.elements[1] as HTMLInputElement).value

    inputRef.current?.clearValue()
    inputRef.current?.focus()

    console.log(`item: ${value}, category: ${category}`)
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
            <Stack>
              <AsyncSelect
                name="item"
                isClearable
                components={{ DropdownIndicator }}
                loadOptions={loadOptions}
                ref={inputRef}
                onChange={handleChange}
                classNamePrefix="add-item"
              />
              <Select
                value={category}
                onChange={(e) => setCategory(e.currentTarget.value)}
              >
                <option value="0"> - </option>
                <option value="1">Fruit & vegetables</option>
                <option value="2">Pantry</option>
                <option value="3">Frozen</option>
              </Select>
            </Stack>
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
