import { Item } from "@/firebase";
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
} from "@chakra-ui/react";

type ItemDetailsModalProps = UseDisclosureReturn & {
  item: Item | undefined;
};

export const ItemDetailsModal = ({
  isOpen,
  onClose,
  item,
}: ItemDetailsModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{item?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack>
            <Heading size="sm">Notes</Heading>
            <Text>{item?.notes || "n/a"}</Text>
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
