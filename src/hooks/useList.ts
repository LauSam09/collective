import { useContext } from "react";

import { ListContext } from "@/contexts/ListContext";

export const useList = () => {
  const listContext = useContext(ListContext);

  if (!listContext) {
    throw new Error("useList must be used within a ListProvider");
  }

  return listContext;
};
