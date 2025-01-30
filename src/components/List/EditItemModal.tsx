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
  Select,
  FormLabel,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { doc, updateDoc } from "firebase/firestore";
import { logEvent } from "firebase/analytics";

import { Item } from "@/models/item";
import { useAuthentication, useFirebase, useList } from "@/hooks";

interface Form {
  category: string;
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
    defaultValues: { notes: item?.notes, category: item?.category ?? "" },
  });
  const { firestore, analytics } = useFirebase();
  const { appUser } = useAuthentication();
  const { categories } = useList();

  useEffect(() => {
    reset({ notes: item?.notes, category: item?.category ?? "" });
  }, [item, isOpen]);

  const handleSave = async (item: Form) => {
    const itemRef = doc(
      firestore,
      "groups",
      appUser!.group.id,
      "lists",
      appUser!.group.defaultList,
      "items",
      props.item!.id,
    );

    updateDoc(itemRef, {
      category: item.category,
      notes: item.notes,
    });

    logEvent(analytics, "edit_item_details");

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(handleSave)}>
          <ModalHeader>{item?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormLabel>
              Category
              <Select
                {...register("category")}
                placeholder="Select a category"
                mt={1}
              >
                {categories.map((category) => (
                  <option value={category.id} key={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </FormLabel>
            <FormLabel>
              Notes
              <Textarea {...register("notes")} mt={1} />
            </FormLabel>
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
