import {
  SearchIcon,
  AddIcon,
} from "@chakra-ui/icons"
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Tag,
  TagLabel,
  useDisclosure,
} from "@chakra-ui/react"
import { Text } from "@chakra-ui/react"
import { useState } from "react"

import { EditRecipeModal } from "../components/Recipes/EditRecipeModal"
import { RecipeDetailsModal } from "../components/Recipes/RecipeDetailsModal"
import { Recipe } from "../models/recipe"

const initialRecipes: ReadonlyArray<Recipe> = [
  {
    id: "1",
    name: "Lasagne",
    ingredients: ["eggs", "milk", "flour"],
    days: [6],
  },
  {
    id: "2",
    name: "Pancakes",
    ingredients: ["eggs", "milk", "flour"],
    days: [1, 2],
  },
  {
    id: "3",
    name: "Penne Arrabiata",
    url: "https://www.bbc.co.uk/food/recipes/pennealarrabiatapast_83813",
    notes:
      "A spicy pasta dish that has many words that we're using to test what happens",
    ingredients: [
      "penne",
      "tomatoes",
      "garlic",
      "chilli flakes",
      "sugar",
      "parmesan",
    ],
    days: [0, 3, 5],
  },
]

export const RecipesPage = () => {
  const today = new Date()
  const editDisclosure = useDisclosure()
  const detailsDisclose = useDisclosure()
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>()
  const [recipes, setRecipes] = useState(initialRecipes)
  const [expandedDays, setExpandedDays] = useState([today.getDay()])
  const allDaysExpanded = expandedDays.length === 7;
  
  const handleClickDetails = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
    detailsDisclose.onOpen()
  }

  const handleClickDetailsEdit = () => {
    detailsDisclose.onClose()
    editDisclosure.onOpen()
  }

  const handleClickDelete = () => {
    // TODO: Add confirmation
    setRecipes((r) => r.filter((x) => x.id !== selectedRecipe?.id))
    setSelectedRecipe(undefined)
    editDisclosure.onClose()
    detailsDisclose.onClose()
  }

  const handleClickClearWeek = () => {
    // TODO: Add confirmation
    setRecipes((old) => old.map((r) => ({ ...r, days: [] })))
    setExpandedDays([])
  }

  const handleToggleExpandAllDays = () => {
    if (allDaysExpanded) {
      setExpandedDays([])
    } else {
      setExpandedDays([0, 1, 2, 3, 4, 5, 6])
    }
  }

  const handleClickDay = (day: number) => {
    if (expandedDays.includes(day)) {
      setExpandedDays(old => old.filter(d => d !== day))
    } else {
      setExpandedDays(old => [...old, day])
    }
  }
  
  const days: ReadonlyArray<{ name: string; recipes: Array<Recipe> }> = [
    { name: "Sunday", recipes: [] },
    { name: "Monday", recipes: [] },
    { name: "Tuesday", recipes: [] },
    { name: "Wednesday", recipes: [] },
    { name: "Thursday", recipes: [] },
    { name: "Friday", recipes: [] },
    { name: "Saturday", recipes: [] },
  ]

  for (const recipe of recipes.filter((r) => r.days && r.days.length > 0)) {
    recipe.days?.forEach((d) => days[d].recipes.push(recipe))
  }

  return (
    <>
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={2}>
          <Heading size="md">Planning</Heading>
          <Flex gap={2}>
            <Button variant="outline" onClick={handleToggleExpandAllDays}>{allDaysExpanded ? "Collapse all" : "Expand all"}</Button>
            <Button variant="outline" onClick={handleClickClearWeek}>Clear</Button>
          </Flex>
        </Flex>
        <Accordion allowMultiple mb={4} index={expandedDays}>
          {days.map((day, i) => (
            <AccordionItem key={i} onClick={() => handleClickDay(i)}>
              <AccordionButton>
                <Box
                  as="span"
                  flex="1"
                  textAlign="left"
                  fontWeight={i === today.getDay() ? "bold" : "default"}
                >
                  {day.name}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                {day.recipes.map((recipe) => (
                  <Card
                    key={recipe.id}
                    cursor="pointer"
                    onClick={() => handleClickDetails(recipe)}
                    size="sm"
                  >
                    <CardBody>
                      <Flex>
                        <Box flex={1}>
                          <Text>{recipe.name}</Text>
                        </Box>
                      </Flex>
                    </CardBody>
                  </Card>
                ))}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
        <Flex justifyContent="space-between" alignItems="center" mb={2}>
          <Heading size="md">Recipes</Heading>
          <Button>
            <AddIcon />
          </Button>
        </Flex>
        <Box mb={4}>
          <form>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input placeholder="Search by name" />
            </InputGroup>
          </form>
        </Box>
        <Box>
          <Stack>
            {recipes.map((recipe) => (
              <Card
                key={recipe.id}
                size="sm"
                cursor="pointer"
                onClick={() => handleClickDetails(recipe)}
              >
                <CardBody>
                  <Flex>
                    <Box maxW="100%" flex={1}>
                      <Flex maxW="100%" overflow="hidden">
                        <Text whiteSpace="nowrap" mr={2}>
                          {recipe.name}
                        </Text>
                        <HStack spacing={1}>
                          {["Sun"].map((day) => (
                            <Tag
                              key={day}
                              borderRadius="full"
                              variant="solid"
                              colorScheme="blue"
                            >
                              <TagLabel>{day}</TagLabel>
                            </Tag>
                          ))}
                        </HStack>
                      </Flex>
                      <Text fontSize="sm">{recipe.ingredients.join(", ")}</Text>
                    </Box>
                  </Flex>
                </CardBody>
              </Card>
            ))}
          </Stack>
        </Box>
      </Box>
      <RecipeDetailsModal
        {...detailsDisclose}
        recipe={selectedRecipe}
        onClickEdit={handleClickDetailsEdit}
        onClickDelete={handleClickDelete}
      />
      <EditRecipeModal {...editDisclosure} recipe={selectedRecipe} />
    </>
  )
}
