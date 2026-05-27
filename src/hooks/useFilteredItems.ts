import { Item } from "@/firebase";
import { normalizeName } from "@/utilities";
import { useItems } from "./useItems";

export function useFilteredItems(searchTerm: string) {
  const itemsQuery = useItems();

  if (!itemsQuery.isFetched || searchTerm === "") {
    return { filteredItems: [], hasExactMatch: false };
  }

  const normalizedSearchTerm = normalizeName(searchTerm);

  const filteredItems = (itemsQuery.data as ReadonlyArray<Item>)
    .filter((i) => i.lowerName.includes(normalizedSearchTerm))
    .slice(0, 10);

  const hasExactMatch = filteredItems.some(
    (i) => i.lowerName === normalizedSearchTerm,
  );

  return { filteredItems, hasExactMatch };
}
