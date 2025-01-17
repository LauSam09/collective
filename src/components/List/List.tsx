import React, { useState } from "react";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Menu } from "lucide-react";

import { useListItems, useMatchingRecipes } from "@/hooks";
import { Category, Item, updateItemCompleted } from "@/firebase";
import { useUser } from "@/contexts";
import { ItemDetailsModal } from "./ItemDetailsModal";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

// TODO: Handle uncategorised items

export const List = () => {
  const { isPending, isError, data } = useListItems();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item>();

  const handleClickDetails = (item: Item) => {
    setSelectedItem(item);
    setIsDetailsOpen(true);
  };

  if (isPending) {
    return <CategorySkeleton />;
  }

  if (isError) {
    return <CategoryError />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mx-auto gap-4">
        {data.map((category) => (
          <div key={category.name}>
            <ListCategory category={category}>
              {category.items.map((item) => (
                <ListItem
                  key={item.id}
                  item={item}
                  onOpenDetails={() => handleClickDetails(item)}
                />
              ))}
            </ListCategory>
          </div>
        ))}
      </div>
      <ItemDetailsModal
        item={selectedItem!}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </>
  );
};

// TODO: Update for large resolutions
const CategorySkeleton = () => (
  <div className="flex flex-col gap-2">
    {/* <div className="flex gap-2 justify-between">
      <Skeleton className="rounded-full h-[3rem] w-[3rem]" />
      <Skeleton className="rounded-full h-[3rem] w-[3rem]" />
      <Skeleton className="rounded-full h-[3rem] w-[3rem]" />
      <Skeleton className="rounded-full h-[3rem] w-[3rem]" />
    </div> */}
    <div className="flex flex-col gap-2">
      <Skeleton className="h-[120px]" />
      <Skeleton className="h-[60px]" />
      <Skeleton className="h-[120px]" />
      <Skeleton className="h-[180px]" />
      <Skeleton className="h-[60px]" />
    </div>
  </div>
);

const CategoryError = () => <div>Error loading categories</div>;

const ListCategory = ({
  category,
  children,
}: {
  category: Category;
  children: React.ReactNode;
}) => {
  const hasChildren = React.Children.count(children) > 0;

  return (
    <Card className="border-none">
      <CardHeader
        className={hasChildren ? "rounded-t-xl" : "rounded-xl"}
        style={{ backgroundColor: `${category.colour}75` }}
      >
        <h2 className="text-sm font-bold">
          {category.name.toLocaleUpperCase()}
        </h2>
      </CardHeader>
      {hasChildren && (
        <CardContent
          className="pt-6 rounded-b-xl"
          style={{ backgroundColor: `${category.colour}50` }}
        >
          <div className="flex flex-col gap-2">{children}</div>
        </CardContent>
      )}
    </Card>
  );
};

const ListItem = ({
  item,
  onOpenDetails,
}: {
  item: Item;
  onOpenDetails: () => void;
}) => {
  const { groupId, defaultListId } = useUser();
  const matchingRecipesQuery = useMatchingRecipes(item.lowerName);

  const handleItemChecked = async (e: CheckedState) => {
    const completed = e;

    if (typeof completed !== "boolean") {
      return;
    }

    await updateItemCompleted(groupId, defaultListId, item.id, completed);
  };

  // TODO: Fix overflowing items
  return (
    <div
      key={item.name}
      className="group flex justify-between items-center h-12"
      data-completed={item.completed}
    >
      <Checkbox
        id={item.id}
        onCheckedChange={(e) => handleItemChecked(e)}
        checked={item.completed}
        className="scale-150 mr-3"
      />
      <label
        htmlFor={item.id}
        className="flex-1 cursor-pointer group-data-[completed=true]:text-gray-600 dark:group-data-[completed=true]:text-gray-700"
      >
        <div>
          <p className="inline group-data-[completed=true]:line-through">
            {item.name}
          </p>
          {item.notes && (
            <div className="ml-1 text-xs inline">- {item.notes}</div>
          )}
        </div>
      </label>
      <div className="w-12 h-12">
        {matchingRecipesQuery.data?.length > 0 ? (
          <Button
            onClick={onOpenDetails}
            variant="secondary"
            className="h-full w-full font-bold"
          >
            {matchingRecipesQuery.data?.length}
          </Button>
        ) : (
          <Button
            onClick={onOpenDetails}
            variant="secondary"
            className="h-full w-full"
          >
            <Menu />
          </Button>
        )}
      </div>
    </div>
  );
};
