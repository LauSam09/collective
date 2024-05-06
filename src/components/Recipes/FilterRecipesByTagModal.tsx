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

const cuisineTags = [
  { id: "american", name: "American" },
  { id: "asian", name: "Asian" },
  { id: "greek", name: "Greek" },
  { id: "indian", name: "Indian" },
  { id: "italian", name: "Italian" },
  { id: "mexican", name: "Mexican" },
  { id: "middle_eastern", name: "Middle Eastern" },
  { id: "spanish", name: "Spanish" },
];

const dishTypeTags = [
  { id: "breakfast", name: "Breakfast" },
  { id: "baking", name: "Baking" },
  { id: "dessert", name: "Dessert" },
  { id: "light", name: "Light" },
  { id: "rapid", name: "Rapid" },
];

// const otherTags = [
//   // Seasonal
//   { id: "summer", name: "Summer" },
//   { id: "winter", name: "Winter" },

//   // Dietary requirements
//   { id: "Vegetarian", name: "Vegetarian" },
//   { id: "Vegan", name: "Vegan" },
// ];

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
              <Stack>
                <Heading size="xs" mb={2}>
                  Cuisines
                </Heading>
                {cuisineTags.map((tag) => (
                  <Checkbox
                    key={tag.id}
                    name={tag.id}
                    defaultChecked={filterTags.includes(tag.id)}
                  >
                    {tag.name}
                  </Checkbox>
                ))}
              </Stack>
              <Stack>
                <Heading size="xs" mb={2}>
                  Type
                </Heading>
                {dishTypeTags.map((tag) => (
                  <Checkbox
                    key={tag.id}
                    name={tag.id}
                    defaultChecked={filterTags.includes(tag.id)}
                  >
                    {tag.name}
                  </Checkbox>
                ))}
              </Stack>
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
