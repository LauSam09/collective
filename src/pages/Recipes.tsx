import { SearchIcon, AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Tag,
  TagLabel,
  useDisclosure,
} from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";

import { EditRecipeModal } from "../components/Recipes/EditRecipeModal";
import { RecipeDetailsModal } from "../components/Recipes/RecipeDetailsModal";
import { Recipe } from "../models/recipe";
import { useAuthentication, useFirebase } from "../hooks";
import { useDebounce } from "../hooks/useDebounce";

export const RecipesPage = () => {
  const editDisclosure = useDisclosure();
  const detailsDisclose = useDisclosure();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>();
  const [recipes, setRecipes] = useState<ReadonlyArray<Recipe>>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<ReadonlyArray<Recipe>>(
    [],
  );
  const [filterValue, setFilterValue] = useState("");
  const debouncedFilterValue = useDebounce(filterValue, 300);
  const { firestore } = useFirebase();
  const { appUser } = useAuthentication();

  const handleClickDetails = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    detailsDisclose.onOpen();
  };

  const handleClickDetailsEdit = () => {
    detailsDisclose.onClose();
    editDisclosure.onOpen();
  };

  const handleClickDelete = () => {
    // TODO: Add confirmation
    setRecipes((r) => r.filter((x) => x.id !== selectedRecipe?.id));
    setSelectedRecipe(undefined);
    editDisclosure.onClose();
    detailsDisclose.onClose();
  };

  const handleUpdateRecipeDays = async (id: string, days: Array<number>) => {
    const docRef = doc(firestore, "groups", appUser!.group!.id, "recipes", id);
    await updateDoc(docRef, {
      days,
    });
    setSelectedRecipe((r) => ({ ...r!, days }));
  };

  // TODO: Likely move into a context to share between recipes and planning
  useEffect(() => {
    const q = query(
      collection(firestore, "groups", appUser!.group!.id, "recipes"),
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const recipes: Array<Recipe> = [];
      querySnapshot.forEach((doc) => {
        recipes.push({ ...doc.data(), id: doc.id } as unknown as Recipe);
      });
      const sortedRecipes = recipes.sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      setRecipes(sortedRecipes);
    });

    return () => {
      unsubscribe();
    };
  }, []);

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
    }
  }, [debouncedFilterValue]);

  const displayRecipes = debouncedFilterValue ? filteredRecipes : recipes;

  const selectedDays = recipes
    .filter((r) => r.days && r.days.length > 0)
    .map((r) => r.days as number[])
    .flat();

  return (
    <>
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={2}>
          <Heading size="md">Recipes</Heading>
          <Button>
            <AddIcon />
          </Button>
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
                        {recipe.ingredients?.join(", ")}
                      </Text>
                    </Box>
                  </Flex>
                </CardBody>
              </Card>
            ))}
          </Stack>
        </Box>
      </Box>
      <RecipeDetailsModal
        {...detailsDisclose}
        recipe={selectedRecipe}
        selectedDays={selectedDays}
        onClickEdit={handleClickDetailsEdit}
        onClickDelete={handleClickDelete}
        onUpdateDays={(days: Array<number>) =>
          handleUpdateRecipeDays(selectedRecipe!.id, days)
        }
      />
      <EditRecipeModal {...editDisclosure} recipe={selectedRecipe} />
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
