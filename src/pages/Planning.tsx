import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Link,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState, MouseEvent } from "react";

import { Recipe } from "../models/recipe";
import { RecipeDetailsModal } from "../components/Recipes/RecipeDetailsModal";
import { EditRecipeModal } from "../components/Recipes/EditRecipeModal";
import useRecipes from "../hooks/useRecipes";
import { ExternalLinkIcon } from "@chakra-ui/icons";

// const initialRecipes: ReadonlyArray<Recipe> = [
//   {
//     id: "1",
//     name: "Lasagne",
//     ingredients: ["eggs", "milk", "flour"],
//     days: [6],
//   },
//   {
//     id: "2",
//     name: "Pancakes",
//     ingredients: ["eggs", "milk", "flour"],
//     days: [1, 2],
//   },
//   {
//     id: "3",
//     name: "Penne Arrabiata",
//     recipeUrl: "https://www.bbc.co.uk/food/recipes/pennealarrabiatapast_83813",
//     notes:
//       "A spicy pasta dish that has many words that we're using to test what happens",
//     ingredients: [
//       "penne",
//       "tomatoes",
//       "garlic",
//       "chilli flakes",
//       "sugar",
//       "parmesan",
//     ],
//     days: [0, 3, 5],
//   },
// ];

export const PlanningPage = () => {
  const { recipes } = useRecipes();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>();
  const editDisclosure = useDisclosure();
  const detailsDisclose = useDisclosure();
  const today = new Date();
  const [expandedDays, setExpandedDays] = useState([today.getDay()]);
  const allDaysExpanded = expandedDays.length === 7;

  const handleClickDay = (day: number) => {
    if (expandedDays.includes(day)) {
      setExpandedDays((old) => old.filter((d) => d !== day));
    } else {
      setExpandedDays((old) => [...old, day]);
    }
  };

  const handleClickClearWeek = () => {
    // TODO: Add confirmation
    // setRecipes((old) => old.map((r) => ({ ...r, days: [] })));
    // setExpandedDays([]);
  };

  const handleToggleExpandAllDays = () => {
    if (allDaysExpanded) {
      setExpandedDays([]);
    } else {
      setExpandedDays([0, 1, 2, 3, 4, 5, 6]);
    }
  };

  const handleClickDetails = (
    event: MouseEvent<HTMLDivElement>,
    recipe: Recipe,
  ) => {
    event.stopPropagation();
    setSelectedRecipe(recipe);
    detailsDisclose.onOpen();
  };

  const handleClickDetailsEdit = () => {
    detailsDisclose.onClose();
    editDisclosure.onOpen();
  };

  const handleClickDelete = () => {
    // TODO: Add confirmation
    // setRecipes((r) => r.filter((x) => x.id !== selectedRecipe?.id));
    setSelectedRecipe(undefined);
    editDisclosure.onClose();
    detailsDisclose.onClose();
  };

  const days: ReadonlyArray<{ name: string; recipes: Array<Recipe> }> = [
    { name: "Sunday", recipes: [] },
    { name: "Monday", recipes: [] },
    { name: "Tuesday", recipes: [] },
    { name: "Wednesday", recipes: [] },
    { name: "Thursday", recipes: [] },
    { name: "Friday", recipes: [] },
    { name: "Saturday", recipes: [] },
  ];

  for (const recipe of recipes.filter((r) => r.days && r.days.length > 0)) {
    recipe.days?.forEach((d) => days[d].recipes.push(recipe));
  }

  const selectedDays = recipes
    .filter((r) => r.days && r.days.length > 0)
    .map((r) => r.days as number[])
    .flat();

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={2}>
        <Heading size="md">Planning</Heading>
        <Flex gap={2}>
          <Button variant="outline" onClick={handleToggleExpandAllDays}>
            {allDaysExpanded ? "Collapse all" : "Expand all"}
          </Button>
          <Button variant="outline" onClick={handleClickClearWeek}>
            Clear
          </Button>
        </Flex>
      </Flex>
      <Accordion allowMultiple mb={4} index={expandedDays}>
        {days.map((day, i) => (
          <AccordionItem key={i} onClick={() => handleClickDay(i)}>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                <Heading as="h3" size="sm">
                  {day.name} {i === today.getDay() && "*"}
                </Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Box>
                {day.recipes.map((recipe) => (
                  <Card
                    key={recipe.id}
                    cursor="pointer"
                    onClick={(e) => handleClickDetails(e, recipe)}
                    size="sm"
                  >
                    <CardBody>
                      <Flex>
                        <Flex flex={1}>
                          <Text mr={2}>{recipe.name}</Text>
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
                        </Flex>
                      </Flex>
                      <Text fontSize="sm">
                        {recipe.ingredients?.map((i) => i.trim()).join(", ")}
                      </Text>
                    </CardBody>
                  </Card>
                ))}
              </Box>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
      <RecipeDetailsModal
        {...detailsDisclose}
        recipe={selectedRecipe}
        selectedDays={selectedDays}
        onClickEdit={handleClickDetailsEdit}
        onClickDelete={handleClickDelete}
        onUpdateDays={() => {}}
      />
      <EditRecipeModal {...editDisclosure} recipe={selectedRecipe} />
    </Box>
  );
};
