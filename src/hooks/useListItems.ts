import { UseQueryResult } from "@tanstack/react-query";

import { useUser } from "@/contexts";
import { Item } from "@/firebase";
import { useAddedItems, useCategories } from "@/hooks";

export const useListItems = () => {
  const { groupId, defaultListId } = useUser();
  const categoryQuery = useCategories();
  const addedItemsQuery = useAddedItems(
    groupId,
    defaultListId,
  ) as UseQueryResult<ReadonlyArray<Item>, Error>;

  let data = (categoryQuery?.data ?? [])
    .sort((a, b) => a.order - b.order)
    .map((cat) => ({ ...cat, items: [] as ReadonlyArray<Item> }));

  if (!addedItemsQuery.isPending) {
    for (const category of data) {
      category.items =
        addedItemsQuery.data
          ?.filter((i) => i.category === category.id)
          ?.sort((a, b) => a.lowerName.localeCompare(b.lowerName)) ?? [];
    }

    data = data.sort((a, b) => {
      if (a.items.length > 0 && b.items.length > 0) {
        return 0;
      }

      if (a.items.length === 0 && b.items.length === 0) {
        return a.order - b.order;
      }

      if (a.items.length === 0) {
        return 1;
      }

      return -1;
    });
  }

  return {
    isPending: categoryQuery.isPending || addedItemsQuery.isPending,
    isError: categoryQuery.isError || categoryQuery.isError,
    data,
  };
};
