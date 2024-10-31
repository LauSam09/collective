import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  UseDisclosureReturn,
  Stack,
  Text,
  Heading,
  Box,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";

import { Item } from "@/firebase";
import { useAddedRecipes } from "@/hooks";
import { normalizeName } from "@/utilities";

type ItemDetailsModalProps = UseDisclosureReturn & {
  item: Item | undefined;
};

export const ItemDetailsModal = ({
  isOpen,
  onClose,
  item,
}: ItemDetailsModalProps) => {
  const { data } = useAddedRecipes();

  const matchingRecipes = (data ?? []).filter((recipe) =>
    recipe.ingredients.map(normalizeName).includes(item?.lowerName ?? ""),
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{item?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack gap={3}>
            <Box>
              <Heading size="sm">Notes</Heading>
              <Text>{item?.notes || "n/a"}</Text>
            </Box>

            <Box>
              <Heading size="sm">Selected recipes</Heading>
              {matchingRecipes.length > 0 ? (
                <UnorderedList>
                  {matchingRecipes.map((recipe) => (
                    <ListItem key={recipe.id}>{recipe.name}</ListItem>
                  ))}
                </UnorderedList>
              ) : (
                <Text>n/a</Text>
              )}
            </Box>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          {/* <Button variant="ghost">Edit</Button> */}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
