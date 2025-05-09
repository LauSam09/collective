import { addRecipe, Item, Recipe } from "@/firebase";
import { queryClient } from "@/react-query";
import { useEffect, useState } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";
import { X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useUser } from "@/contexts";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { tagDictionary, tags } from "@/models/tags";
import { ItemComboBox } from "../List/AddItemModal";

type RecipeDetailsModalProps = {
  open: boolean;

  onClose: () => void;
};

interface DetailsForm {
  name: string;
  ingredients: Array<{ name: string }>;
  externalLink?: string;
  notes?: string;
  tags: Array<{ name: string }>;
}

export const AddRecipeModal = ({ open, onClose }: RecipeDetailsModalProps) => {
  const { groupId } = useUser();
  const form = useForm<DetailsForm>({
    defaultValues: {
      name: "",
      ingredients: [],
      externalLink: "",
      notes: "",
      tags: [],
    },
  });

  const ingredientsFieldArrray = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  const [selectedIngredient, setSelectedIngredient] = useState<Item | null>(
    null,
  );

  const tagFieldArray = useFieldArray({ control: form.control, name: "tags" });
  const [query, setQuery] = useState("");
  const allTags = tags
    .filter(
      (tag) => !tagFieldArray.fields.some((field) => field.name === tag.id),
    )
    .map((tag) => ({ id: tag.id, name: tag.name }));
  const [selectedTag, setSelectedTag] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const filteredTags =
    query === ""
      ? allTags
      : allTags.filter((tag) =>
          tag.name.toLowerCase().includes(query.toLowerCase()),
        );

  useEffect(() => {
    if (selectedTag) {
      tagFieldArray.append({ name: selectedTag.id });
    }
  }, [selectedTag]);

  const handleSubmit = (data: DetailsForm) => {
    const addedRecipe: Partial<Recipe> = {
      name: data.name,
      ingredients: data.ingredients.map((ingredient) => ingredient.name),
      notes: data.notes ?? "",
      recipeUrl: data.externalLink ?? "",
      tags: data.tags.map((tag) => tag.name),
    };

    addRecipe(groupId, addedRecipe);
    queryClient.setQueryData(["recipes", groupId], (oldData: Recipe[] = []) =>
      [...oldData, addedRecipe].sort((a, b) => a.name!.localeCompare(b.name!)),
    );
    onClose();
  };

  const handleClickAddTag = (tag: { id: string } | null) => {
    if (!tag) {
      return;
    }

    tagFieldArray.append({ name: tag.id });
  };

  const handleSelectItem = (item: Item | null) => {
    if (!item) {
      return;
    }

    if (
      ingredientsFieldArrray.fields.some((field) => field.name === item.name)
    ) {
      setSelectedIngredient(null);
      return;
    }

    ingredientsFieldArrray.append({ name: item.name });
    setSelectedIngredient(null);
  };

  const handleClickRemoveTag = (index: number) => {
    tagFieldArray.remove(index);
    setSelectedTag(null);
  };

  const handleClickRemoveIngredient = (index: number) => {
    ingredientsFieldArrray.remove(index);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} modal={false}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add recipe</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-2"
          >
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Ingredients</FormLabel>
              {ingredientsFieldArrray.fields.length > 0 && (
                <ul className="flex flex-row flex-wrap gap-1">
                  {ingredientsFieldArrray.fields.map((field, index) => (
                    <li key={field.id} className="inline">
                      <Badge
                        variant="secondary"
                        onClick={() => handleClickRemoveIngredient(index)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          {field.name}
                          <X size="12" />
                        </div>
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
              <ItemComboBox
                placeholder="Add ingredient"
                showAddedIcon={false}
                selectedItem={selectedIngredient}
                onSelectItem={handleSelectItem}
              />
            </FormItem>

            <FormField
              control={form.control}
              name="externalLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>External link</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Tags</FormLabel>
              {tagFieldArray.fields.length > 0 && (
                <ul className="flex flex-row flex-wrap gap-1">
                  {tagFieldArray.fields.map((tag, index) => (
                    <li key={tag.id} className="inline">
                      {/* TODO: Consider factoring out a plus/minus button component */}
                      <Badge
                        variant="secondary"
                        onClick={() => handleClickRemoveTag(index)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          {tagDictionary[tag.name]?.name || tag.name}
                          <X size="12" />
                        </div>
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
              <Combobox
                immediate
                value={selectedTag}
                onChange={handleClickAddTag}
                onClose={() => setQuery("")}
              >
                <ComboboxInput
                  displayValue={(tag: { name: string }) => tag?.name}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Add tag"
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full justify-start"
                />
                <ComboboxOptions
                  anchor="bottom"
                  className="border empty:invisible z-[60] bg-background w-[var(--input-width)]"
                >
                  {filteredTags.map((tag) => (
                    <ComboboxOption
                      key={tag.id}
                      value={tag}
                      className="data-[focus]:bg-accent p-1"
                    >
                      {tag.name}
                    </ComboboxOption>
                  ))}
                </ComboboxOptions>
              </Combobox>
            </FormItem>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="secondary"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button>Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
