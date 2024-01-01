import {
  SearchIcon,
  AddIcon,
  ExternalLinkIcon,
  CloseIcon,
} from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  Stack,
  Tag,
  TagLabel,
  useDisclosure,
} from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { logEvent } from "firebase/analytics";

import { AddRecipeModal } from "../components/Recipes/AddRecipeModal";
import { EditRecipeModal } from "../components/Recipes/EditRecipeModal";
import { RecipeDetailsModal } from "../components/Recipes/RecipeDetailsModal";
import { Recipe } from "../models/recipe";
import {
  useAuthentication,
  useFirebase,
  useRecipes,
  useDebounce,
} from "../hooks";

const INCREMENT = 20;

export const RecipesPage = () => {
  const { recipes } = useRecipes();
  const addDisclosure = useDisclosure();
  const editDisclosure = useDisclosure();
  const detailsDisclosure = useDisclosure();
  const confirmDeletionDisclosure = useDisclosure();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>();
  const [filteredRecipes, setFilteredRecipes] = useState<ReadonlyArray<Recipe>>(
    [],
  );
  const [filterValue, setFilterValue] = useState("");
  const [debouncedFilterValue, setDebouncedFilterValue] = useDebounce(
    filterValue,
    300,
  );
  const { analytics, firestore } = useFirebase();
  const { appUser } = useAuthentication();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [displayCount, setDisplayCount] = useState(INCREMENT);

  const handleClickDetails = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    detailsDisclosure.onOpen();
  };

  const handleClickDetailsEdit = () => {
    detailsDisclosure.onClose();
    editDisclosure.onOpen();
  };

  const handleClickDelete = () => confirmDeletionDisclosure.onOpen();

  const handleConfirmDelete = async () => {
    confirmDeletionDisclosure.onClose();
    editDisclosure.onClose();
    detailsDisclosure.onClose();

    await deleteDoc(
      doc(
        firestore,
        "groups",
        appUser!.group!.id,
        "recipes",
        selectedRecipe!.id,
      ),
    );

    logEvent(analytics, "delete_recipe", { from: "recipes" });

    setSelectedRecipe(undefined);
  };

  const handleUpdateRecipeDays = async (id: string, days: Array<number>) => {
    const docRef = doc(firestore, "groups", appUser!.group!.id, "recipes", id);
    await updateDoc(docRef, {
      days,
    });
    setSelectedRecipe((r) => ({ ...r!, days }));
  };

  useEffect(() => {
    if (!debouncedFilterValue) {
      setFilteredRecipes([]);
    } else {
      const normalisedFilterValue = debouncedFilterValue.trim().toLowerCase();
      const filtered = recipes.filter(
        (r) =>
          r.name.toLowerCase().includes(normalisedFilterValue) ||
          r.ingredients?.some((i) =>
            i.toLowerCase().includes(normalisedFilterValue),
          ),
      );
      setFilteredRecipes(filtered);
      setDisplayCount(INCREMENT);
    }
  }, [debouncedFilterValue]);

  const handleClearSearch = () => {
    setDebouncedFilterValue("");
    setFilterValue("");
  };

  const totalDisplayRecipes = debouncedFilterValue ? filteredRecipes : recipes;

  const displayRecipes = totalDisplayRecipes.slice(0, displayCount);

  const selectedDays = recipes
    .filter((r) => r.days && r.days.length > 0)
    .map((r) => r.days as number[])
    .flat();

  return (
    <>
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={2}>
          <Heading size="md">Recipes</Heading>
          <IconButton onClick={addDisclosure.onOpen} aria-label="Add recipe">
            <AddIcon />
          </IconButton>
        </Flex>
        <Box mb={4}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search by name or ingredient"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
            <InputRightElement>
              <IconButton
                size="sm"
                variant="ghost"
                aria-label="Clear recipe search"
                onClick={handleClearSearch}
              >
                <CloseIcon />
              </IconButton>
            </InputRightElement>
          </InputGroup>
        </Box>
        <Box>
          <Stack>
            {displayRecipes.map((recipe) => (
              <Card
                key={recipe.id}
                size="sm"
                cursor="pointer"
                onClick={() => handleClickDetails(recipe)}
              >
                <CardBody>
                  <Flex>
                    <Box maxW="100%" flex={1}>
                      <Flex maxW="100%" overflow="hidden">
                        <Text whiteSpace="nowrap" mr={2}>
                          {recipe.name}
                        </Text>
                        {recipe.recipeUrl && (
                          <Link
                            href={recipe.recipeUrl}
                            target="_blank"
                            mr={2}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLinkIcon />
                          </Link>
                        )}

                        <HStack spacing={1}>
                          {recipe.days?.map((day) => (
                            <Tag
                              key={day}
                              borderRadius="full"
                              variant="solid"
                              colorScheme="blue"
                            >
                              <TagLabel>{dayNumberToDisplay(day)}</TagLabel>
                            </Tag>
                          ))}
                        </HStack>
                      </Flex>
                      <Text fontSize="sm">
                        {recipe.ingredients
                          ?.slice(0, 4)
                          .map((i) => i.trim())
                          .join(", ")}
                        {recipe.ingredients?.length > 4 &&
                          ` + ${recipe.ingredients.length - 4} more`}
                      </Text>
                    </Box>
                  </Flex>
                </CardBody>
              </Card>
            ))}
          </Stack>
        </Box>
        <HStack justifyContent="center" p={2}>
          {totalDisplayRecipes.length > displayCount && (
            <Button onClick={() => setDisplayCount((old) => old + INCREMENT)}>
              Load more
            </Button>
          )}
        </HStack>
      </Box>
      <AddRecipeModal {...addDisclosure} />
      <RecipeDetailsModal
        {...detailsDisclosure}
        recipe={selectedRecipe}
        selectedDays={selectedDays}
        onClickEdit={handleClickDetailsEdit}
        onClickDelete={handleClickDelete}
        onUpdateDays={(days: Array<number>) =>
          handleUpdateRecipeDays(selectedRecipe!.id, days)
        }
      />
      <EditRecipeModal {...editDisclosure} recipe={selectedRecipe} />
      <AlertDialog
        isOpen={confirmDeletionDisclosure.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={confirmDeletionDisclosure.onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Recipe
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can&apos;t undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={confirmDeletionDisclosure.onClose}
              >
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleConfirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
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
