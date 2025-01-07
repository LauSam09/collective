import { useQuery } from "@tanstack/react-query";
import { collection, orderBy, query } from "firebase/firestore";

import { firestore } from "@/firebase";
import { createQuery } from "@/react-query";
import { useUser } from "@/contexts";

export function useItems() {
  const { groupId, defaultListId } = useUser();

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
