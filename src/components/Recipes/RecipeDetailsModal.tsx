import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  ExternalLinkIcon,
  MinusIcon,
} from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  VStack,
  Text,
  Link,
  Heading,
  Flex,
  HStack,
  Tag,
  TagLabel,
  Button,
  ModalFooter,
  TagCloseButton,
  Box,
} from "@chakra-ui/react";

import { Recipe } from "@/models/recipe";
import { useList } from "@/hooks";
import { normalizeName } from "@/utilities/normalization";
import { tags } from "@/models/recipeTags";

export type RecipeDetailsModalProps = {
  isOpen: boolean;
  recipe: Recipe | undefined;
  selectedDays: number[];
  onClose: () => void;
  onClickEdit: () => void;
  onClickDelete: () => void;
  onUpdateDays: (days: Array<number>) => void;
};

export const RecipeDetailsModal = (props: RecipeDetailsModalProps) => {
  const {
    isOpen,
    recipe,
    selectedDays,
    onClose,
    onClickEdit,
    onClickDelete,
    onUpdateDays,
  } = props;
  // TODO: Add normalised version of added items in context
  const { addedItems, upsertItemByName, removeItem } = useList();
  const normalisedAddedItems = addedItems.map((i) => ({
    lowerName: i.lowerName,
    id: i.id,
  }));

  const recipeDays = recipe?.days ?? [];

  const handleAddDayClick = (day: number) => onUpdateDays([...recipeDays, day]);

  const handleRemoveDayClick = (day: number) =>
    onUpdateDays(recipeDays.filter((d) => d !== day) ?? []);

  const handleClickDelete = () => onClickDelete();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex justifyContent="space-between">
            <Text>{recipe?.name}</Text>
            <Flex gap={2}>
              <Button onClick={onClickEdit}>
                <EditIcon />
              </Button>
              <Button colorScheme="red" onClick={handleClickDelete}>
                <DeleteIcon />
              </Button>
            </Flex>
          </Flex>
        </ModalHeader>

        <ModalBody>
          <VStack alignItems="flex-start">
            <HStack spacing={1} rowGap={1} flexWrap="wrap" mb={2}>
              {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                const thisRecipeIsOnThisDay = recipeDays.includes(day);
                const anotherRecipeIsOnThisDay = selectedDays.includes(day);

                return (
                  <Tag
                    key={day}
                    borderRadius="full"
                    size="sm"
                    variant={thisRecipeIsOnThisDay ? "solid" : "subtle"}
                    colorScheme={
                      thisRecipeIsOnThisDay || anotherRecipeIsOnThisDay
                        ? "blue"
                        : undefined
                    }
                  >
                    <TagLabel>{dayNumberToDisplay(day)}</TagLabel>
                    {thisRecipeIsOnThisDay ? (
                      <TagCloseButton
                        onClick={() => handleRemoveDayClick(day)}
                      />
                    ) : (
                      <TagCloseButton onClick={() => handleAddDayClick(day)}>
                        <AddIcon boxSize="12px" />
                      </TagCloseButton>
                    )}
                  </Tag>
                );
              })}
            </HStack>

            <Heading size="sm">Tags</Heading>
            {recipe?.tags === undefined || recipe.tags.length === 0 ? (
              <Text>No tags yet</Text>
            ) : (
              <HStack spacing={1} rowGap={1}>
                {recipe.tags.map((t) => (
                  <Tag key={t}>{tags.find((tag) => tag.id === t)?.name}</Tag>
                ))}
              </HStack>
            )}

            {recipe?.recipeUrl && (
              <>
                <Heading size="sm">
                  Recipe link <ExternalLinkIcon mx="2px" />
                </Heading>
                <Link isExternal href={recipe?.recipeUrl} width="100%">
                  <Flex>
                    <Text
                      fontSize="sm"
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {recipe?.recipeUrl}
                    </Text>
                  </Flex>
                </Link>
              </>
            )}
            {recipe?.notes && (
              <Box>
                <Heading size="sm">Notes</Heading>
                <Text>{recipe.notes}</Text>
              </Box>
            )}
            {recipe?.ingredients && recipe.ingredients.length > 0 && (
              <>
                <Heading size="sm">Ingredients</Heading>
                <HStack wrap="wrap" rowGap="2" mb={2}>
                  {recipe.ingredients.map((i) => {
                    const normalized = normalizeName(i);
                    const isAdded = normalisedAddedItems.filter(
                      (i) => i.lowerName == normalized,
                    )?.[0];

                    if (isAdded) {
                      return (
                        <Tag colorScheme={"blue"} key={i}>
                          <TagLabel>{i}</TagLabel>
                          <TagCloseButton
                            onClick={() => removeItem(isAdded.id)}
                          >
                            <MinusIcon boxSize="12px" />
                          </TagCloseButton>
                        </Tag>
                      );
                    }

                    return (
                      <Tag key={i}>
                        <TagLabel>{i}</TagLabel>
                        <TagCloseButton onClick={() => upsertItemByName(i)}>
                          <AddIcon boxSize="12px" />
                        </TagCloseButton>
                      </Tag>
                    );
                  })}
                </HStack>
              </>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const dayNumberToDisplay = (dayNumber: number) => {
  switch (dayNumber) {
    case 0:
      return "Mon";
    case 1:
      return "Tue";
    case 2:
      return "Wed";
    case 3:
      return "Thu";
    case 4:
      return "Fri";
    case 5:
      return "Sat";
    case 6:
      return "Sun";
  }
};
