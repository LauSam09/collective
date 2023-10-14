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
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Item } from "../../models/item";

interface Form {
  notes: string;
}

export type EditItemModalProps = {
  isOpen: boolean;
  item: Item | undefined;
  onClose: () => void;
};

export const EditItemModal = (props: EditItemModalProps) => {
  const { isOpen, item, onClose } = props;
  const { register, handleSubmit, reset } = useForm<Form>({
    defaultValues: { notes: item?.notes },
  });

  useEffect(() => {
    reset({ notes: item?.notes });
  }, [item]);

  const handleSave = (item: Form) => {
    // TODO: save here
    console.log(item);

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(handleSave)}>
          <ModalHeader>[Edit] {item?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <label>
              Notes
              <Textarea {...register("notes")} />
            </label>
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
  );
};
