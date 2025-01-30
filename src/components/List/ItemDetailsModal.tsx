import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Heading,
  Text,
  Flex,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";
import { EditIcon, MinusIcon } from "@chakra-ui/icons";

import { Item } from "@/models/item";
import { normalizeName } from "@/utilities/normalization";
import { useRecipes, useList } from "@/hooks";

type ItemDetailsModalProps = {
  isOpen: boolean;
  item: Item | undefined;
  onClose: () => void;
  onEdit: () => void;
};

export const ItemDetailsModal = (props: ItemDetailsModalProps) => {
  const { isOpen, item, onClose, onEdit } = props;
  const { recipes } = useRecipes();
  const { removeItem } = useList();

  // TODO: Move to context
  const addedRecipes = recipes.filter((r) => r.days && r.days.length > 0);

  const matchingRecipes = addedRecipes.filter((r) => {
    const normalizedRecipeIngredients =
      r.ingredients?.map((i) => normalizeName(i)) ?? [];

    if (
      item?.lowerName &&
      normalizedRecipeIngredients.includes(item?.lowerName)
    ) {
      return true;
    }
  });

  const handleRemoveClick = () => {
    if (!item) {
      return;
    }

    removeItem(item.id);

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex justifyContent="space-between">
            <Text>{item?.name}</Text>
            <Flex gap={2}>
              <Button onClick={onEdit}>
                <EditIcon />
              </Button>
              <Button onClick={handleRemoveClick} aria-label="Remove">
                <MinusIcon />
              </Button>
            </Flex>
          </Flex>
        </ModalHeader>
        <ModalBody>
          <Heading size="sm">Notes</Heading>
          <Text mb="1rem">{item?.notes ? item.notes : "n/a"}</Text>
          <Heading size="sm">Planned recipes</Heading>
          {matchingRecipes.length > 0 ? (
            <UnorderedList>
              {matchingRecipes.map((r) => (
                <ListItem key={r.id}>{r.name}</ListItem>
              ))}
            </UnorderedList>
          ) : (
            <Text>n/a</Text>
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
