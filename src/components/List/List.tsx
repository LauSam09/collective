import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import React from "react";

import { useListItems } from "@/hooks";
import { Category, Item, updateItemCompleted } from "@/firebase";
import { useUser } from "@/contexts";

export const List = () => {
  const { isPending, isError, data } = useListItems();

  if (isPending) {
    return <CategorySkeleton />;
  }

  if (isError) {
    return <CategoryError />;
  }

  return (
    <Grid
      templateColumns={{
        base: "1fr",
        md: "repeat(2, 1fr)",
        xl: "repeat(3, 1fr)",
        "2xl": "repeat(4, 1fr)",
      }}
      mx="auto"
      gap={4}
    >
      {data.map((category) => (
        <GridItem key={category.name}>
          <ListCategory category={category}>
            {category.items.map((item) => (
              <ListItem key={item.id} item={item} />
            ))}
          </ListCategory>
        </GridItem>
      ))}
    </Grid>
  );
};

const CategorySkeleton = () => (
  <Stack>
    {/* <HStack justifyContent="space-between">
      <SkeletonCircle size="3rem" />
      <SkeletonCircle size="3rem" />
      <SkeletonCircle size="3rem" />
      <SkeletonCircle size="3rem" />
    </HStack> */}
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

const ListCategory = ({
  category,
  children,
}: {
  category: Category;
  children: React.ReactNode;
}) => (
  <Card>
    <CardHeader backgroundColor={`${category.colour}75`}>
      <Heading size="xs">{category.name.toLocaleUpperCase()}</Heading>
    </CardHeader>
    {React.Children.count(children) > 0 && (
      <CardBody backgroundColor={`${category.colour}50`}>
        <Stack gap={2}>{children}</Stack>
      </CardBody>
    )}
  </Card>
);

const ListItem = ({ item }: { item: Item }) => {
  const { groupId, defaultListId } = useUser();

  const handleItemChecked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const completed = e.target.checked;

    if (typeof completed !== "boolean") {
      return;
    }

    await updateItemCompleted(groupId, defaultListId, item.id, completed);
  };

  return (
    <Flex key={item.name} justifyContent="space-between">
      <Checkbox
        onChange={(e) => handleItemChecked(e)}
        isChecked={item.completed}
        size="lg"
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
        className="list-checkbox"
        flex={1}
      >
        <Box color={item.completed ? "gray.500" : "default"}>
          <Text as={item.completed ? "s" : "p"} display="inline">
            {item.name}
          </Text>
          {item.notes && (
            <Text fontSize="xs" ml="1" display="inline">
              - {item.notes}
            </Text>
          )}
        </Box>
      </Checkbox>
      <IconButton aria-label="Open item details">
        <HamburgerIcon />
      </IconButton>
    </Flex>
  );
};
