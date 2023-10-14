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
import { useState } from "react";

import { EditRecipeModal } from "../components/Recipes/EditRecipeModal";
import { RecipeDetailsModal } from "../components/Recipes/RecipeDetailsModal";
import { Recipe } from "../models/recipe";

const initialRecipes: ReadonlyArray<Recipe> = [
  {
    id: "1",
    name: "Lasagne",
    ingredients: ["eggs", "milk", "flour"],
    days: [6],
  },
  {
    id: "2",
    name: "Pancakes",
    ingredients: ["eggs", "milk", "flour"],
    days: [1, 2],
  },
  {
    id: "3",
    name: "Penne Arrabiata",
    url: "https://www.bbc.co.uk/food/recipes/pennealarrabiatapast_83813",
    notes:
      "A spicy pasta dish that has many words that we're using to test what happens",
    ingredients: [
      "penne",
      "tomatoes",
      "garlic",
      "chilli flakes",
      "sugar",
      "parmesan",
    ],
    days: [0, 3, 5],
  },
];

export const RecipesPage = () => {
  const editDisclosure = useDisclosure();
  const detailsDisclose = useDisclosure();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>();
  const [recipes, setRecipes] = useState(initialRecipes);

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
