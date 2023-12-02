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
} from "@chakra-ui/react";
import { Item } from "../../models/item";
import { EditIcon } from "@chakra-ui/icons";

type ItemDetailsModalProps = {
  isOpen: boolean;
  item: Item | undefined;
  onClose: () => void;
  onEdit: () => void;
};

export const ItemDetailsModal = (props: ItemDetailsModalProps) => {
  const { isOpen, item, onClose, onEdit } = props;

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
            </Flex>
          </Flex>
        </ModalHeader>
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
