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
import { useUser } from "@/contexts";
import { getCategories } from "@/firebase";

export const List = () => {
  const { groupId, defaultListId } = useUser();
  const categoryQuery = useQuery({
    queryKey: ["categories", groupId, defaultListId],
    queryFn: () => getCategories(groupId, defaultListId),
  });

  if (categoryQuery.isPending) {
    return <CategorySkeleton />;
  }

  if (categoryQuery.isError) {
    return <CategoryError />;
  }

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
