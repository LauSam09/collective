import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { logEvent } from "firebase/analytics";

import { AddRecipeModal } from "@/components/Recipes/AddRecipeModal";
import { EditRecipeModal } from "@/components/Recipes/EditRecipeModal";
import { RecipeDetailsModal } from "@/components/Recipes/RecipeDetailsModal";
import { Recipe } from "@/models/recipe";
import {
  useAuthentication,
  useFirebase,
  useRecipes,
  useDebounce,
} from "@/hooks";
import { ConfirmDeleteRecipeAlert } from "./ConfirmDeleteRecipeAlert";
import { RecipeCard } from "./RecipeCard";
import { FilterRecipes } from "./FilterRecipes";
import { tags } from "@/models/recipeTags";

const INCREMENT = 20;

export const Recipes = () => {
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
  const [filterTags, setFilterTags] = useState<ReadonlyArray<string>>([]);
  const [debouncedFilterValue, setDebouncedFilterValue] = useDebounce(
    filterValue,
    300,
  );
  const { analytics, firestore } = useFirebase();
  const { appUser } = useAuthentication();
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

    deleteDoc(
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
    updateDoc(docRef, {
      days,
    });
    setSelectedRecipe((r) => ({ ...r!, days }));
  };

  useEffect(() => {
    if (!debouncedFilterValue && filterTags.length === 0) {
      setFilteredRecipes([]);
    } else {
      const normalisedFilterValue = debouncedFilterValue.trim().toLowerCase();

      let workingRecipes = [...recipes];

      if (filterTags.length > 0) {
        const tagObjects = filterTags.map(
          (ft) => tags.find((t) => t.id === ft)!,
        );

        const orTags = tagObjects
          .filter((t) => t.type === "cuisine")
          .map((t) => t.id);
        const andTags = tagObjects
          .filter((t) => t.type === "type")
          .map((t) => t.id);

        workingRecipes = workingRecipes
          .filter(
            (r) =>
              orTags.length === 0 || orTags.some((t) => r.tags?.includes(t)),
          )
          .filter(
            (r) =>
              andTags.length === 0 || andTags.every((t) => r.tags?.includes(t)),
          );
      }

      const filtered = workingRecipes.filter(
        (r) =>
          r.name.toLowerCase().includes(normalisedFilterValue) ||
          r.ingredients?.some((i) =>
            i.toLowerCase().includes(normalisedFilterValue),
          ),
      );

      setFilteredRecipes(filtered);
      setDisplayCount(INCREMENT);
    }
  }, [debouncedFilterValue, filterTags, recipes]);

  const handleClearSearch = () => {
    setDebouncedFilterValue("");
    setFilterValue("");
  };

  const filteringActive = filterTags.length > 0 || filterValue;

  const totalDisplayRecipes = filteringActive ? filteredRecipes : recipes;

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
          <FilterRecipes
            filterValue={filterValue}
            filterTags={filterTags}
            onUpdateFilterValue={setFilterValue}
            onUpdateFilterTags={setFilterTags}
            onClearSearch={handleClearSearch}
          />
        </Box>
        <Box>
          <Stack>
            {displayRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClickDetails={() => handleClickDetails(recipe)}
              />
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
        onUpdateDays={(days) =>
          handleUpdateRecipeDays(selectedRecipe!.id, days)
        }
      />
      <EditRecipeModal {...editDisclosure} recipe={selectedRecipe} />
      <ConfirmDeleteRecipeAlert
        {...confirmDeletionDisclosure}
        onConfirmDelete={handleConfirmDelete}
      />
    </>
  );
};
