import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  CardBody,
  Flex,
  HStack,
  Link,
  Tag,
  TagLabel,
} from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { Recipe } from "@/models/recipe";

export type RecipeCardProps = {
  recipe: Recipe;
  onClickDetails: () => void;
};

export const RecipeCard = (props: RecipeCardProps) => {
  const { recipe, onClickDetails } = props;

  return (
    <Card key={recipe.id} size="sm" cursor="pointer" onClick={onClickDetails}>
      <CardBody>
        <Flex>
          <Box maxW="100%" flex={1}>
            <Flex maxW="100%" overflow="hidden">
              <Text whiteSpace="nowrap" mr={2}>
                {recipe.name}
              </Text>
              {recipe.recipeUrl && (
                <Link
                  href={recipe.recipeUrl}
                  target="_blank"
                  mr={2}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLinkIcon />
                </Link>
              )}

              <HStack spacing={1}>
                {recipe.days?.map((day) => (
                  <Tag
                    key={day}
                    borderRadius="full"
                    variant="solid"
                    colorScheme="blue"
                  >
                    <TagLabel>{dayNumberToDisplay(day)}</TagLabel>
                  </Tag>
                ))}
              </HStack>
            </Flex>
            <Text fontSize="sm">
              {recipe.ingredients
                ?.slice(0, 4)
                .map((i) => i.trim())
                .join(", ")}
              {recipe.ingredients?.length > 4 &&
                ` + ${recipe.ingredients.length - 4} more`}
            </Text>
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );
};

const dayNumberToDisplay = (dayNumber: number) => {
  switch (dayNumber) {
    case 0:
      return "Mon";
    case 1:
      return "Tue";
    case 2:
      return "Wed";
    case 3:
      return "Thu";
    case 4:
      return "Fri";
    case 5:
      return "Sat";
    case 6:
      return "Sun";
  }
};
