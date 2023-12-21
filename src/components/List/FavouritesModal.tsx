import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Tag,
  VStack,
  TagCloseButton,
  TagLabel,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import { useList } from "../../hooks/useList";

export type FavouritesModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const FavouritesModal = (props: FavouritesModalProps) => {
  const { isOpen, onClose } = props;
  const { unaddedItems, quickAddItem } = useList();

  const favouriteItems = unaddedItems
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Favourite items</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack alignItems="flex-start" gap={2}>
            {favouriteItems.map((item) => (
              <Tag key={item.name} size="lg">
                <TagLabel>{item.name}</TagLabel>
                <TagCloseButton onClick={() => quickAddItem(item.id)}>
                  <AddIcon boxSize="12px" />
                </TagCloseButton>
              </Tag>
            ))}
          </VStack>
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
