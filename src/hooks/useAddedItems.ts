import { useItems } from "./useItems";

export function useAddedItems() {
  const itemsQuery = useItems();

  // @ts-expect-error test
  return { ...itemsQuery, data: itemsQuery.data?.filter((i) => i.added) };
}
