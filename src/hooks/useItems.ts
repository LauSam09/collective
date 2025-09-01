import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { collection, orderBy, query } from "firebase/firestore";

import { firestore, Item } from "@/firebase";
import { createQuery } from "@/react-query";
import { useUser } from "@/contexts";

export function useItems(): UseQueryResult<ReadonlyArray<Item>, Error> {
  const { groupId, defaultListId } = useUser();

  // @ts-expect-error todo
  return useQuery({
    queryKey: ["items", groupId, defaultListId],
    queryFn: createQuery(() =>
      query(
        collection(
          firestore,
          "groups",
          groupId,
          "lists",
          defaultListId,
          "items",
        ),
        orderBy("name"),
      ),
    ),
    enabled: !!groupId && !!defaultListId,
  });
}
