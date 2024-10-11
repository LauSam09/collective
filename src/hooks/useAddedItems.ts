import { useQuery } from "@tanstack/react-query";
import { collection, query, where } from "firebase/firestore";

import { firestore, Item } from "@/firebase";
import { createQuery } from "@/react-query";

export function useAddedItems(groupId: string, listId: string) {
  return useQuery({
    queryKey: ["active-items", groupId, listId],
    queryFn: createQuery(() =>
      query(
        collection(firestore, "groups", groupId, "lists", listId, "items"),
        where("added", "==", true),
      ),
    ),
    enabled: !!groupId && !!listId,
  });
}
