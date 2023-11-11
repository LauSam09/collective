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
import { doc, updateDoc } from "firebase/firestore";
import { logEvent } from "firebase/analytics";

import { Item } from "../../models/item";
import { useAuthentication, useFirebase } from "../../hooks";

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
  const { firestore, analytics } = useFirebase();
  const { appUser } = useAuthentication();

  useEffect(() => {
    reset({ notes: item?.notes });
  }, [item]);

  const handleSave = async (item: Form) => {
    if (item.notes !== props.item?.notes) {
      const itemRef = doc(
        firestore,
        "groups",
        appUser!.group.id,
        "lists",
        appUser!.group.defaultList,
        "items",
        props.item!.id,
      );
      await updateDoc(itemRef, {
        notes: item.notes,
      });

      logEvent(analytics, "edit_item_details");
    }

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
