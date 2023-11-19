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
import { collection, onSnapshot, query } from "firebase/firestore";

import { EditRecipeModal } from "../components/Recipes/EditRecipeModal";
import { RecipeDetailsModal } from "../components/Recipes/RecipeDetailsModal";
import { Recipe } from "../models/recipe";
import { useAuthentication, useFirebase } from "../hooks";

export const RecipesPage = () => {
  const editDisclosure = useDisclosure();
  const detailsDisclose = useDisclosure();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>();
  const [recipes, setRecipes] = useState<ReadonlyArray<Recipe>>([]);
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
          <form>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input placeholder="Search by name" />
            </InputGroup>
          </form>
        </Box>
        <Box>
          <Stack>
            {recipes.map((recipe) => (
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
                          {["Sun"].map((day) => (
                            <Tag
                              key={day}
                              borderRadius="full"
                              variant="solid"
                              colorScheme="blue"
                            >
                              <TagLabel>{day}</TagLabel>
                            </Tag>
                          ))}
                        </HStack>
                      </Flex>
                      <Text fontSize="sm">{recipe.ingredients.join(", ")}</Text>
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
        onClickEdit={handleClickDetailsEdit}
        onClickDelete={handleClickDelete}
      />
      <EditRecipeModal {...editDisclosure} recipe={selectedRecipe} />
    </>
  );
};
