import { AddIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  TagCloseButton,
  Tag,
  TagLabel,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { doc, updateDoc } from "firebase/firestore";

import { Recipe } from "../../models/recipe";
import { useAuthentication, useFirebase } from "../../hooks";
import { logEvent } from "firebase/analytics";

interface Form {
  name: string;
  ingredients: ReadonlyArray<{ name: string }>;
  notes: string;
  recipeUrl?: string;
}

export type EditRecipeModalProps = {
  isOpen: boolean;
  recipe: Recipe | undefined;
  onClose: () => void;
};

export const EditRecipeModal = (props: EditRecipeModalProps) => {
  const { isOpen, recipe, onClose } = props;
  const { appUser } = useAuthentication();
  const { analytics, firestore } = useFirebase();
  const { control, formState, register, handleSubmit, reset, watch } =
    useForm<Form>({
      defaultValues: {
        ...recipe,
        ingredients: recipe?.ingredients?.map((i) => ({ name: i })) ?? [],
      },
    });
  const { append, remove } = useFieldArray({ control, name: "ingredients" });
  const [ingredient, setIngredient] = useState("");

  useEffect(() => {
    reset({
      ...recipe,
      ingredients: recipe?.ingredients?.map((i) => ({ name: i })) ?? [],
    });
  }, [recipe, isOpen]);

  const handleAddIngredient = () => {
    if (!ingredient) {
      return;
    }

    append({ name: ingredient });
    setIngredient("");
  };

  const handleSave = async (form: Form) => {
    const { name, recipeUrl, notes, ingredients } = form;

    const docRef = doc(
      firestore,
      "groups",
      appUser!.group.id,
      "recipes",
      recipe!.id,
    );

    await updateDoc(docRef, {
      name,
      recipeUrl,
      notes,
      ingredients: ingredients.map((i) => i.name),
    });

    logEvent(analytics, "edit_recipe");

    onClose();
  };

  const ingredients = watch("ingredients");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(handleSave)}>
          <ModalHeader>[Edit] {recipe?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input {...register("name")} />
              </FormControl>
              <FormControl>
                <FormLabel>External link</FormLabel>
                <Input {...register("recipeUrl")} />
              </FormControl>
              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Textarea {...register("notes")} />
              </FormControl>

              <FormControl>
                <FormLabel>Ingredients</FormLabel>
                <HStack wrap="wrap" rowGap="2" mb={2}>
                  {ingredients?.map((ingredient, i) => (
                    <Tag key={i}>
                      <TagLabel>{ingredient.name}</TagLabel>
                      <TagCloseButton onClick={() => remove(i)} />
                    </Tag>
                  ))}
                </HStack>
                <HStack>
                  <Input
                    value={ingredient}
                    onChange={(e) => setIngredient(e.target.value)}
                  />
                  <Button type="button" onClick={handleAddIngredient}>
                    <AddIcon />
                  </Button>
                </HStack>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              type="submit"
              isLoading={formState.isSubmitting}
            >
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
