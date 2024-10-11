import {
  Card,
  CardHeader,
  Heading,
  HStack,
  Skeleton,
  SkeletonCircle,
  Stack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { collection, query } from "firebase/firestore";

import { useUser } from "@/contexts";
import { firestore, getCategories } from "@/firebase";
import { createQuery } from "@/react-query";

export const List = () => {
  const { groupId, defaultListId } = useUser();
  const categoryQuery = useQuery({
    queryKey: ["categories", groupId, defaultListId],
    queryFn: () => getCategories(groupId, defaultListId),
  });
  const itemsQuery = useItems(groupId, defaultListId);

  if (categoryQuery.isPending || itemsQuery.isPending) {
    return <CategorySkeleton />;
  }

  if (categoryQuery.isError || itemsQuery.isError) {
    return <CategoryError />;
  }

  console.log(itemsQuery.data);

  return (
    <Stack>
      {categoryQuery.data.map((category) => (
        <Card key={category.name}>
          <CardHeader backgroundColor={`${category.colour}75`}>
            <Heading size="xs">{category.name.toLocaleUpperCase()}</Heading>
          </CardHeader>
        </Card>
      ))}
    </Stack>
  );
};

const CategorySkeleton = () => (
  <Stack>
    <HStack justifyContent="space-between">
      <SkeletonCircle size="3rem" />
      <SkeletonCircle size="3rem" />
      <SkeletonCircle size="3rem" />
      <SkeletonCircle size="3rem" />
    </HStack>
    <Stack>
      <Skeleton height="120px" />
      <Skeleton height="60px" />
      <Skeleton height="120px" />
      <Skeleton height="180px" />
      <Skeleton height="60px" />
    </Stack>
  </Stack>
);

const CategoryError = () => <div>Error loading categories</div>;

export function useItems(groupId: string, listId: string) {
  return useQuery({
    queryKey: ["active-items", groupId, listId],
    queryFn: createQuery(() =>
      query(collection(firestore, "groups", groupId, "lists", listId, "items")),
    ),
    enabled: !!groupId && !!listId,
  });
}
