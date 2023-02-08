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
import { useForm } from "react-hook-form"

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
  const { register, handleSubmit, reset } = useForm<Form>({
    defaultValues: { ...recipe },
  })
  const [ingredients, setIngredients] = useState(recipe?.ingredients ?? [])

  useEffect(() => {
    reset({ ...recipe })
    setIngredients(recipe?.ingredients ?? [])
  }, [recipe])

  const handleSave = (recipe: Form) => {
    // TODO: save here
    console.log(recipe)

    onClose()
  }

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
                <HStack wrap="wrap" rowGap="2">
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
                  <Tag px={3} colorScheme="green" cursor="pointer">
                    <AddIcon />
                  </Tag>
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
