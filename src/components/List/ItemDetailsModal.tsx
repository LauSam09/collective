import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Heading,
  Text,
} from "@chakra-ui/react";
import { Item } from "../../models/item";

type ItemDetailsModalProps = {
  isOpen: boolean;
  item: Item | undefined;
  onClose: () => void;
};

export const ItemDetailsModal = (props: ItemDetailsModalProps) => {
  const { isOpen, item, onClose } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{item?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Heading size="sm">Notes</Heading>
          <Text mb="1rem">{item?.notes ? item.notes : "n/a"}</Text>
          {/* <Heading size="sm">Recipes</Heading>
          <Text>TODO: A list of active recipes that this item is used in</Text> */}
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
