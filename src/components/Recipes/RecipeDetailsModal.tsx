import {
  addItem,
  Item,
  readdItem,
  Recipe,
  removeItem,
  updateRecipe,
} from "@/firebase";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ExternalLink, Plus, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { useAddedItems } from "@/hooks";
import { normalizeName } from "@/utilities";
import { useUser } from "@/contexts";
import { useItems } from "@/hooks/useItems";
import { useFieldArray, useForm } from "react-hook-form";
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
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";
import { tagDictionary, tags } from "@/models/tags";
import { queryClient } from "@/react-query";
import { ItemComboBox } from "../List/AddItemModal";

type RecipeDetailsModalProps = {
  recipe: Recipe | undefined;
  open: boolean;

  onOpenChange: (open: boolean) => void;
};

// TODO: Consider factoring out common modal elements.
export const RecipeDetailsModal = (props: RecipeDetailsModalProps) => {
  const [mode, setMode] = useState<"readonly" | "edit">("readonly");

  useEffect(() => {
    if (!props.open) {
      setMode("readonly");
    }
  }, [props.open]);

  switch (mode) {
    case "readonly":
      return <ReadonlyDetailsModal {...props} onEdit={() => setMode("edit")} />;
    case "edit":
      return (
        <EditDetailsModal {...props} onCancel={() => setMode("readonly")} />
      );
  }
};

type DisplayIngredient = {
  name: string;
  added: boolean;
  id: string | undefined;
};

const ReadonlyDetailsModal = ({
  open,
  recipe,
  onEdit,
  onOpenChange,
}: RecipeDetailsModalProps & { onEdit: () => void }) => {
  const { groupId, defaultListId } = useUser();
  const addedItemsQuery = useAddedItems();
  const allItemsQuery = useItems();

  const displayIngredients = recipe?.ingredients
    .map((ingredient) => {
      const normalisedIngredient = normalizeName(ingredient);

      const item = addedItemsQuery.data?.find(
        (item) => item.lowerName === normalisedIngredient,
      );

      return { name: ingredient, added: item !== undefined, id: item?.id };
    })
    .sort((a) => (a.added ? 1 : -1));

  const handleClickIngredient = (ingredient: DisplayIngredient) => {
    if (ingredient.added) {
      removeItem(groupId, defaultListId, ingredient.id!);
    } else {
      const normalisedName = normalizeName(ingredient.name);

      const item = allItemsQuery.data?.find(
        (item) => item.lowerName === normalisedName,
      );

      if (item) {
        readdItem(groupId, defaultListId, item.id, item.name);
      } else {
        addItem(groupId, defaultListId, {
          name: ingredient.name,
          lowerName: normalisedName,
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{recipe?.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="font-bold">External link</h2>
            {recipe?.recipeUrl ? (
              <a
                href={recipe.recipeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-sm text-blue-600 dark:text-blue-500 hover:underline"
              >
                <span>{recipe?.recipeUrl}</span>
                <ExternalLink size="16" className="inline ml-1" />
              </a>
            ) : (
              "n/a"
            )}
          </div>

          <div>
            <h2 className="font-bold">Ingredients</h2>
            {displayIngredients && displayIngredients.length > 0 ? (
              <ul className="flex flex-row flex-wrap gap-1">
                {displayIngredients.map((ingredient) => (
                  <li key={ingredient.name} className="inline">
                    <Badge
                      variant={ingredient.added ? "secondary" : "default"}
                      className="cursor-pointer"
                      onClick={() => handleClickIngredient(ingredient)}
                    >
                      <div className="flex items-center gap-2">
                        {ingredient.name}
                        {ingredient.added ? (
                          <X size="12" />
                        ) : (
                          <Plus size="12" />
                        )}
                      </div>
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              "n/a"
            )}
          </div>

          <div>
            <h2 className="font-bold">Notes</h2>
            <p>{recipe?.notes || "n/a"}</p>
          </div>

          <div>
            <h2 className="font-bold">Tags</h2>
            {recipe?.tags && recipe.tags.length > 0 ? (
              <ul className="flex flex-row flex-wrap gap-1">
                {recipe.tags.map((tag) => (
                  <li key={tag} className="inline">
                    <Badge variant="secondary">
                      {tagDictionary[tag]?.name || tag}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              "n/a"
            )}
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="secondary" onClick={onEdit}>
            Edit
          </Button>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface DetailsForm {
  name: string;
  ingredients: Array<{ name: string }>;
  externalLink?: string;
  notes?: string;
  tags: Array<{ name: string }>;
}

const EditDetailsModal = ({
  open,
  recipe,
  onOpenChange,
  onCancel,
}: RecipeDetailsModalProps & { onCancel: () => void }) => {
  const { groupId } = useUser();
  const form = useForm<DetailsForm>({
    defaultValues: {
      name: recipe?.name,
      ingredients:
        recipe?.ingredients.map((ingredient) => ({ name: ingredient })) || [],

      externalLink: recipe?.recipeUrl,
      notes: recipe?.notes,
      tags: recipe?.tags?.map((tag) => ({ name: tag })) || [],
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
    const updatedRecipe: Recipe = {
      id: recipe?.id || "",
      name: data.name,
      ingredients: data.ingredients.map((ingredient) => ingredient.name),
      notes: data.notes,
      recipeUrl: data.externalLink,
      tags: data.tags.map((tag) => tag.name),
    };

    updateRecipe(groupId, updatedRecipe);
    queryClient.setQueryData(["recipes", groupId], (oldData: Recipe[]) =>
      oldData.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r)),
    );
    onCancel();
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{recipe?.name}</DialogTitle>
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
              <Button variant="secondary" onClick={onCancel}>
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
