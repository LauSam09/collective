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
  Tag,
} from "@chakra-ui/react";

import { Item } from "@/firebase";
import { useCategories, useMatchingRecipes } from "@/hooks";

type ItemDetailsModalProps = UseDisclosureReturn & {
  item: Item | undefined;
};

export const ItemDetailsModal = ({
  isOpen,
  onClose,
  item,
}: ItemDetailsModalProps) => {
  const matchingRecipesQuery = useMatchingRecipes(item?.lowerName ?? "");
  const categoriesQuery = useCategories();

  const category = (categoriesQuery.data ?? []).find(
    (c) => item?.category === c.id,
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading size="lg">{item?.name} </Heading>
          <Tag size="sm" bgColor={`${category?.colour}50`} mt={1}>
            {category?.name}
          </Tag>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack gap={3}>
            <Box>
              <Heading size="sm">Notes</Heading>
              <Text>{item?.notes || "n/a"}</Text>
            </Box>

            <Box>
              <Heading size="sm">Selected recipes</Heading>
              {matchingRecipesQuery.data?.length > 0 ? (
                <UnorderedList>
                  {matchingRecipesQuery.data.map((recipe) => (
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
