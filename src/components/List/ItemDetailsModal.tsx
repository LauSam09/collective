import { useForm } from "react-hook-form";
import { Square } from "lucide-react";

import { Item, removeItem, updateItem } from "@/firebase";
import { useCategories, useMatchingRecipes } from "@/hooks";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useUser } from "@/contexts";

type ItemDetailsModalProps = {
  item: Item | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ItemDetailsModal = (props: ItemDetailsModalProps) => {
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
      return <EditDetailsModal {...props} />;
  }
};

const ReadonlyDetailsModal = ({
  open,
  item,
  onOpenChange,
  onEdit,
}: ItemDetailsModalProps & { onEdit: () => void }) => {
  const matchingRecipesQuery = useMatchingRecipes(item?.lowerName ?? "");
  const categoriesQuery = useCategories();
  const { groupId, defaultListId } = useUser();

  const category = (categoriesQuery.data ?? []).find(
    (c) => item?.category === c.id,
  );

  const handleRemove = async () => {
    removeItem(groupId, defaultListId, item!.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {item?.name}
            <Badge
              className="text-xs p-1 ml-2 text-black dark:text-white"
              style={{ backgroundColor: `${category?.colour}50` }}
            >
              {category?.name}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="font-bold">Notes</h2>
            <p>{item?.notes || "n/a"}</p>
          </div>

          <div>
            <h2 className="font-bold">Selected Recipes</h2>
            {/* TODO: Make these links? */}
            {matchingRecipesQuery.data?.length > 0 ? (
              <ul className="list-disc pl-4">
                {matchingRecipesQuery.data.map((recipe) => (
                  <li key={recipe.id}>{recipe.name}</li>
                ))}
              </ul>
            ) : (
              <p>n/a</p>
            )}
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="secondary" onClick={onEdit}>
            Edit
          </Button>
          <Button variant="secondary" onClick={handleRemove}>
            Remove
          </Button>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface DetailsForm {
  notes: string;
  category: string;
}

const EditDetailsModal = ({
  open,
  item,
  onOpenChange,
}: ItemDetailsModalProps) => {
  const categoriesQuery = useCategories();
  const { groupId, defaultListId } = useUser();

  const category = (categoriesQuery.data ?? []).find(
    (c) => item?.category === c.id,
  );

  const form = useForm<DetailsForm>({
    defaultValues: { notes: item?.notes ?? "", category: item?.category },
  });

  const onSubmit = async (values: DetailsForm) => {
    if (!item) {
      return;
    }

    updateItem(groupId, defaultListId, item.id, { ...values });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {item?.name}
            <Badge
              className="text-xs p-1 ml-2 text-black dark:text-white"
              style={{ backgroundColor: `${category?.colour}50` }}
            >
              {category?.name}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoriesQuery.data?.map((c) => (
                        <SelectItem key={c.id} value={c.id} className="mb-1">
                          <div className="flex w-full gap-1 items-center">
                            <Square
                              color={`${c.colour}`}
                              fill={`${c.colour}`}
                            />
                            {c.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <Textarea
                      placeholder="Add some extra detail..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4 gap-2">
              <Button variant="secondary" onClick={() => onOpenChange(false)}>
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
