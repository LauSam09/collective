import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Flex,
  Heading,
  HStack,
  IconButton,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

import { useListItems } from "@/hooks";

export const List = () => {
  const { isPending, isError, data } = useListItems();

  if (isPending) {
    return <CategorySkeleton />;
  }

  if (isError) {
    return <CategoryError />;
  }

  return (
    // TODO: Grid layout falling back to stack?
    <Stack>
      {data.map((category) => (
        <Card key={category.name}>
          <CardHeader backgroundColor={`${category.colour}75`}>
            <Heading size="xs">{category.name.toLocaleUpperCase()}</Heading>
          </CardHeader>
          {category.items.length > 0 && (
            <CardBody backgroundColor={`${category.colour}50`}>
              <Stack gap={2}>
                {category.items.map((item) => (
                  <Flex key={item.name} justifyContent="space-between">
                    <Checkbox
                      // onChange={handleCheckboxChange}
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
                ))}
              </Stack>
            </CardBody>
          )}
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
