import { useQuery } from "@tanstack/react-query";

import { useUser } from "@/contexts";
import { getCategories } from "@/firebase";

export const useCategories = () => {
  const { groupId, defaultListId } = useUser();

  return useQuery({
    queryKey: ["categories", groupId, defaultListId],
    queryFn: () => getCategories(groupId, defaultListId),
  });
};
