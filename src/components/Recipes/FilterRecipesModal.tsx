import { tagTypes, tags } from "@/models/recipeTags";
import {
  Button,
  Checkbox,
  Grid,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { FormEvent } from "react";

export type FilterRecipesModal = {
  filterTags: ReadonlyArray<string>;
  isOpen: boolean;
  onClose: () => void;
  onUpdateFilterTags: (tags: ReadonlyArray<string>) => void;
};

export const FilterRecipesModal = (props: FilterRecipesModal) => {
  const { filterTags, isOpen, onClose, onUpdateFilterTags } = props;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const checkedTags = Array.from(e?.currentTarget.elements)
      .filter((t) => (t as HTMLInputElement).checked)
      .map((t) => (t as HTMLInputElement).name);

    onUpdateFilterTags(checkedTags);
  };

  const handleClear = () => onUpdateFilterTags([]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <form onSubmit={handleSubmit}>
        <ModalContent>
          <ModalHeader>Filter tags</ModalHeader>
          <ModalBody>
            <Grid templateColumns="repeat(2, 1fr)" gap={2}>
              {tagTypes.map((tagType) => (
                <Stack key={tagType.id}>
                  <Heading size="xs" mb={2}>
                    {tagType.name}
                  </Heading>
                  {tags
                    .filter((t) => t.type === tagType.id)
                    .map((tag) => (
                      <Checkbox
                        key={tag.id}
                        name={tag.id}
                        defaultChecked={filterTags.includes(tag.id)}
                      >
                        {tag.name}
                      </Checkbox>
                    ))}
                </Stack>
              ))}
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} type="submit">
              Filter
            </Button>
            <Button onClick={handleClear}>Clear</Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};
