import { AddIcon } from "@chakra-ui/icons"
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
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"

import { Recipe } from "../../models/recipe"

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
  const { control, register, handleSubmit, reset, watch } = useForm<Form>({
    defaultValues: { ...recipe },
  })
  const { append, remove } = useFieldArray({ control, name: "ingredients" })
  const [ingredient, setIngredient] = useState("")

  useEffect(() => {
    reset({ ...recipe })
  }, [recipe])

  const handleAddIngredient = () => {
    if (!ingredient) {
      return
    }

    append(ingredient)
    setIngredient("")
  }

  const handleSave = (recipe: Form) => {
    // TODO: save here
    console.log(recipe)

    onClose()
  }

  const ingredients: ReadonlyArray<string> = watch("ingredients")

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
                  {ingredients?.map((ingredient, i) => (
                    <Tag key={i}>
                      <TagLabel>{ingredient}</TagLabel>
                      <TagCloseButton onClick={() => remove(i)} />
                    </Tag>
                  ))}
                </HStack>
                <HStack>
                  <Input
                    value={ingredient}
                    onChange={(e) => setIngredient(e.target.value)}
                  />
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
