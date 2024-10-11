import { useEffect, useState } from "react";
import { useUser } from "@/contexts";
import {
  Card,
  CardHeader,
  Heading,
  HStack,
  Skeleton,
  SkeletonCircle,
  Stack,
} from "@chakra-ui/react";
import { Category, getCategories } from "@/firebase";

export const List = () => {
  const { groupId, defaultListId } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<ReadonlyArray<Category>>([]);

  useEffect(() => {
    getCategories(groupId, defaultListId)
      .then(setCategories)
      .then(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
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
  }

  return (
    <Stack>
      {categories.map((category) => (
        <Card key={category.name}>
          <CardHeader backgroundColor={`${category.colour}75`}>
            <Heading size="xs">{category.name.toLocaleUpperCase()}</Heading>
          </CardHeader>
        </Card>
      ))}
    </Stack>
  );
};
