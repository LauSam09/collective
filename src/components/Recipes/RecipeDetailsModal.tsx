import {
  CalendarIcon,
  DeleteIcon,
  EditIcon,
  ExternalLinkIcon,
  HamburgerIcon,
  InfoIcon,
} from "@chakra-ui/icons"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  Text,
  Link,
  Heading,
  Flex,
  HStack,
  Tag,
  TagLabel,
  Button,
  ModalFooter,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react"

import { Recipe } from "../../models/recipe"

export type RecipeDetailsModalProps = {
  isOpen: boolean
  recipe: Recipe | undefined
  onClose: () => void
  onClickEdit: () => void
  onClickDelete: () => void
}

export const RecipeDetailsModal = (props: RecipeDetailsModalProps) => {
  const { isOpen, recipe, onClose, onClickEdit, onClickDelete } = props

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex justifyContent="space-between">
            <Text>{recipe?.name}</Text>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<HamburgerIcon />}
              />
              <MenuList>
                <MenuItem icon={<CalendarIcon />}>Assign day</MenuItem>
                <MenuItem icon={<EditIcon />} onClick={onClickEdit}>
                  Edit
                </MenuItem>
                <MenuItem icon={<DeleteIcon />} onClick={onClickDelete}>
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </ModalHeader>

        <ModalBody>
          <VStack alignItems="flex-start">
            {recipe?.url && (
              <>
                <Heading size="sm">
                  Recipe link <ExternalLinkIcon mx="2px" />
                </Heading>
                <Link isExternal href={recipe?.url} width="100%">
                  <Flex>
                    <Text
                      fontSize="sm"
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {recipe?.url}
                    </Text>
                  </Flex>
                </Link>
              </>
            )}
            {recipe?.notes && (
              <>
                <Heading size="sm">Notes</Heading>
                <Text>{recipe.notes}</Text>
              </>
            )}
            {recipe?.ingredients && recipe.ingredients.length > 0 && (
              <>
                <Heading size="sm">Ingredients</Heading>
                <HStack wrap="wrap" rowGap="2" mb={2}>
                  {recipe.ingredients.map((i) => (
                    <Tag key={i}>
                      <TagLabel>{i}</TagLabel>
                    </Tag>
                  ))}
                </HStack>
              </>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
