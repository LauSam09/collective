import { Item } from "@/firebase";
import { normalizeName } from "@/utilities";
import { useItems } from "./useItems";

export function useFilteredItems(searchTerm: string) {
  const itemsQuery = useItems();

  if (!itemsQuery.isFetched || searchTerm === "") {
    return [];
  }

  const normalizedSearchTerm = normalizeName(searchTerm);

  return (itemsQuery.data as ReadonlyArray<Item>)
    .filter((i) => i.lowerName.includes(normalizedSearchTerm))
    .slice(0, 10);
}
