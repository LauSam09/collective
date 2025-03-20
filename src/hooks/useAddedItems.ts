import { useItems } from "./useItems";

export function useAddedItems() {
  const itemsQuery = useItems();

  return { ...itemsQuery, data: itemsQuery.data?.filter((i) => i.added) };
}
