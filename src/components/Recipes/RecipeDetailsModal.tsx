import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  ExternalLinkIcon,
} from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
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
  TagCloseButton,
} from "@chakra-ui/react";

import { Recipe } from "../../models/recipe";

export type RecipeDetailsModalProps = {
  isOpen: boolean;
  recipe: Recipe | undefined;
  onClose: () => void;
  onClickEdit: () => void;
  onClickDelete: () => void;
};

export const RecipeDetailsModal = (props: RecipeDetailsModalProps) => {
  const { isOpen, recipe, onClose, onClickEdit, onClickDelete } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex justifyContent="space-between">
            <Text>{recipe?.name}</Text>
            <Flex gap={2}>
              <Button onClick={onClickEdit}>
                <EditIcon />
              </Button>
              <Button onClick={onClickDelete}>
                <DeleteIcon />
              </Button>
            </Flex>
          </Flex>
        </ModalHeader>

        <ModalBody>
          <VStack alignItems="flex-start">
            <HStack spacing={1} rowGap={1} flexWrap="wrap">
              {["Sun"].map((day) => (
                <Tag
                  key={day}
                  borderRadius="full"
                  variant="solid"
                  colorScheme="blue"
                >
                  <TagLabel>{day}</TagLabel>
                  <TagCloseButton />
                </Tag>
              ))}
              {["Wed", "Thu", "Fri", "Sat"].map((day) => (
                <Tag
                  key={day}
                  borderRadius="full"
                  variant="subtle"
                  colorScheme="green"
                >
                  <TagLabel>{day}</TagLabel>
                  <TagCloseButton>
                    <AddIcon boxSize="12px" />
                  </TagCloseButton>
                </Tag>
              ))}
              {["Mon", "Tue"].map((day) => (
                <Tag key={day} borderRadius="full" variant="subtle">
                  <TagLabel>{day}</TagLabel>
                  <TagCloseButton>
                    <AddIcon boxSize="12px" />
                  </TagCloseButton>
                </Tag>
              ))}
            </HStack>

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
  );
};
