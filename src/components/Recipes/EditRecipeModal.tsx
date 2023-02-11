import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  TagCloseButton,
  Tag,
  TagLabel,
  Box,
} from "@chakra-ui/react"
import AsyncSelect from "react-select/async-creatable"
import { createRef, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { OptionsOrGroups, GroupBase } from "react-select"
import ReactSelect from "react-select/dist/declarations/src/Select"

import { Recipe } from "../../models/recipe"

// TODO: Factor out common react-select types
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

const DropdownIndicator = () => (
  <ChevronDownIcon width="20px" height="20px" mx="8px" />
)

export type SelectRef = ReactSelect<
  { label: string; value: string },
  false,
  GroupBase<{ label: string; value: string }>
>

interface Form {
  name: string
  ingredients: ReadonlyArray<string>
  notes: string
  url?: string
}

export type EditRecipeModalProps = {
  isOpen: boolean
  recipe: Recipe | undefined
  onClose: () => void
}

export const EditRecipeModal = (props: EditRecipeModalProps) => {
  const { isOpen, recipe, onClose } = props
  const { register, handleSubmit, reset } = useForm<Form>({
    defaultValues: { ...recipe },
  })

  const inputRef = createRef<SelectRef>()
  const [ingredients, setIngredients] = useState(recipe?.ingredients ?? [])
  const [selectedIngredient, setSelectedIngredient] = useState<string>()

  useEffect(() => {
    reset({ ...recipe })
    setIngredients(recipe?.ingredients ?? [])
  }, [recipe])

  const handleAddIngredient = () => {
    if (!selectedIngredient) {
      return
    }

    setIngredients((old) => [...old, selectedIngredient])
    setSelectedIngredient(undefined)
    inputRef.current?.clearValue()
  }

  const handleSave = (recipe: Form) => {
    // TODO: save here
    console.log(recipe)

    onClose()
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
        o.name.toLowerCase().includes(inputValue.toLowerCase())
      )
    )

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(handleSave)}>
          <ModalHeader>[Edit] {recipe?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input {...register("name")} />
              </FormControl>
              <FormControl>
                <FormLabel>External link</FormLabel>
                <Input {...register("url")} />
              </FormControl>
              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Textarea {...register("notes")} />
              </FormControl>
              <FormControl>
                <FormLabel>Ingredients</FormLabel>
                <HStack wrap="wrap" rowGap="2" mb={2}>
                  {ingredients.map((i) => (
                    <Tag key={i}>
                      <TagLabel>{i}</TagLabel>
                      <TagCloseButton
                        onClick={() =>
                          setIngredients((o) => o.filter((o) => o !== i))
                        }
                      />
                    </Tag>
                  ))}
                </HStack>
                <HStack>
                  <Box flex={1}>
                    <AsyncSelect
                      name="item"
                      isClearable
                      placeholder="Add ingredient..."
                      components={{ DropdownIndicator }}
                      loadOptions={loadOptions}
                      ref={inputRef}
                      onChange={(value) => setSelectedIngredient(value?.value)}
                      classNamePrefix="add-item"
                    />
                  </Box>
                  <Button type="button" onClick={handleAddIngredient}>
                    <AddIcon />
                  </Button>
                </HStack>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} type="submit">
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
