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
  IconButton,
  Select,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { addDoc, collection } from "firebase/firestore";
import { logEvent } from "firebase/analytics";

import { useAuthentication, useFirebase } from "@/hooks";
import { tagDictionary, tags as allTags } from "@/models/recipeTags";

interface Form {
  name: string;
  ingredients: ReadonlyArray<{ name: string }>;
  notes: string;
  recipeUrl?: string;
  tags: ReadonlyArray<{ id: string }>;
}

export type AddRecipeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const AddRecipeModal = (props: AddRecipeModalProps) => {
  const { isOpen, onClose } = props;
  const { appUser } = useAuthentication();
  const { analytics, firestore } = useFirebase();
  const { control, formState, register, handleSubmit, reset, watch } =
    useForm<Form>();
  const ingredientsFieldArray = useFieldArray({ control, name: "ingredients" });
  const tagsFieldArray = useFieldArray({ control, name: "tags" });
  const [ingredient, setIngredient] = useState("");
  const [tag, setTag] = useState("");

  useEffect(() => {
    reset();
    setIngredient("");
    setTag("");
  }, [isOpen]);

  const handleAddIngredient = () => {
    if (!ingredient) {
      return;
    }

    ingredientsFieldArray.append({ name: ingredient });
    setIngredient("");
  };

  const handleAddTag = (tag: string) => {
    if (tag === "" || tagIds.includes(tag)) {
      return;
    }

    tagsFieldArray.append({ id: tag });
    setTag("");
  };

  const handleSave = async (form: Form) => {
    const { name, recipeUrl, notes, ingredients } = form;

    await addDoc(
      collection(firestore, "groups", appUser!.group.id, "recipes"),
      {
        name,
        recipeUrl,
        notes,
        ingredients: ingredients?.map((i) => i.name.trim()) ?? [],
        tags: tags?.map((t) => t.id) ?? [],
      },
    );

    logEvent(analytics, "add_recipe");

    onClose();
  };

  const ingredients = watch("ingredients");
  const tags = watch("tags") ?? [];
  const tagIds = tags.map((t) => t.id);
  const unaddedTags = allTags.filter((at) => !tagIds.includes(at.id));

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(handleSave)}>
          <ModalHeader>New recipe</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input {...register("name")} />
              </FormControl>

              <FormControl>
                <FormLabel>Tags</FormLabel>
                <HStack rowGap="2" wrap="wrap" mb={2}>
                  {tags.map((t, i) => (
                    <Tag key={i}>
                      <TagLabel>{tagDictionary[t.id].name}</TagLabel>
                      <TagCloseButton
                        onClick={() => tagsFieldArray.remove(i)}
                      />
                    </Tag>
                  ))}
                </HStack>
                <HStack gap={1}>
                  <Select
                    size="sm"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                  >
                    <option key="">-</option>
                    {unaddedTags.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </Select>
                  <IconButton
                    type="button"
                    icon={<AddIcon />}
                    aria-label="Add tag"
                    size="sm"
                    onClick={() => handleAddTag(tag)}
                  />
                </HStack>
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
                      <TagCloseButton
                        onClick={() => ingredientsFieldArray.remove(i)}
                      />
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
