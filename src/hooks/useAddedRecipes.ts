import { useQuery } from "@tanstack/react-query";

import { useUser } from "@/contexts";
import { getAddedRecipes } from "@/firebase";

export const useAddedRecipes = () => {
  const { groupId } = useUser();

  return useQuery({
    queryKey: ["added-recipes", groupId],
    queryFn: () => getAddedRecipes(groupId),
  });
};
