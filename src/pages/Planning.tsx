import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
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
  Link,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState, MouseEvent, useRef } from "react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { logEvent } from "firebase/analytics";
import { deleteDoc, doc, updateDoc, writeBatch } from "firebase/firestore";

import { Recipe } from "../models/recipe";
import { RecipeDetailsModal } from "../components/Recipes/RecipeDetailsModal";
import { EditRecipeModal } from "../components/Recipes/EditRecipeModal";
import useRecipes from "../hooks/useRecipes";
import { useFirebase, useAuthentication } from "../hooks";

export const PlanningPage = () => {
  const { recipes } = useRecipes();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>();
  const editDisclosure = useDisclosure();
  const detailsDisclosure = useDisclosure();
  const confirmDeletionDisclosure = useDisclosure();
  const confirmClearWeekDisclosure = useDisclosure();
  const deleteCancelRef = useRef<HTMLButtonElement>(null);
  const clearCancelRef = useRef<HTMLButtonElement>(null);
  const { analytics, firestore } = useFirebase();
  const { appUser } = useAuthentication();
  const today = new Date();
  const [expandedDays, setExpandedDays] = useState([today.getDay()]);
  const allDaysExpanded = expandedDays.length === 7;

  const days: ReadonlyArray<{
    name: string;
    recipes: Array<Recipe>;
    jsIndex: number;
  }> = [
    { name: "Monday", recipes: [], jsIndex: 1 },
    { name: "Tuesday", recipes: [], jsIndex: 2 },
    { name: "Wednesday", recipes: [], jsIndex: 3 },
    { name: "Thursday", recipes: [], jsIndex: 4 },
    { name: "Friday", recipes: [], jsIndex: 5 },
    { name: "Saturday", recipes: [], jsIndex: 6 },
    { name: "Sunday", recipes: [], jsIndex: 0 },
  ];

  for (const recipe of recipes.filter((r) => r.days && r.days.length > 0)) {
    recipe.days?.forEach((d) => days[d].recipes.push(recipe));
  }

  const handleClickDay = (day: number) => {
    if (expandedDays.includes(day)) {
      setExpandedDays((old) => old.filter((d) => d !== day));
    } else {
      setExpandedDays((old) => [...old, day]);
    }
  };

  const handleClickClearWeek = () => confirmClearWeekDisclosure.onOpen();

  const handleConfirmClearWeek = async () => {
    confirmClearWeekDisclosure.onClose();

    const batch = writeBatch(firestore);

    days.forEach((d) => {
      d.recipes.forEach((r) => {
        const docRef = doc(
          firestore,
          "groups",
          appUser!.group!.id,
          "recipes",
          r.id,
        );
        batch.update(docRef, {
          days: [],
        });
      });
    });

    await batch.commit();

    logEvent(analytics, "clear_week");
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

    logEvent(analytics, "delete_recipe", { from: "planning" });

    setSelectedRecipe(undefined);
  };

  const handleUpdateRecipeDays = async (id: string, days: Array<number>) => {
    const docRef = doc(firestore, "groups", appUser!.group!.id, "recipes", id);
    await updateDoc(docRef, {
      days,
    });
    setSelectedRecipe((r) => ({ ...r!, days }));
  };

  const selectedDays = recipes
    .filter((r) => r.days && r.days.length > 0)
    .map((r) => r.days as number[])
    .flat();

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
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
                {/* JS: 0 Sun, 1 Mon, 2 Tue, 3 Wed, 4 Thu, 5 Fri, 6 Sat */}
                {/* DB: 0 Mon, 1 Tue, 2 Wed, 3 Thu, 4 Fri, 5 Sat, 6 Sun,*/}
                <Heading as="h3" size="sm">
                  {day.name} {today.getDay() === day.jsIndex && "*"}
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
        leastDestructiveRef={deleteCancelRef}
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
                ref={deleteCancelRef}
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
      <AlertDialog
        isOpen={confirmClearWeekDisclosure.isOpen}
        leastDestructiveRef={clearCancelRef}
        onClose={confirmClearWeekDisclosure.onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Clear week
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can&apos;t undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={clearCancelRef}
                onClick={confirmClearWeekDisclosure.onClose}
              >
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleConfirmClearWeek} ml={3}>
                Clear
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};
