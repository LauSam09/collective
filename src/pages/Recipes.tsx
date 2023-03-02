import { HamburgerIcon, DeleteIcon, SearchIcon } from "@chakra-ui/icons"
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
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
    days: [],
  },
  {
    id: "2",
    name: "Pancakes",
    ingredients: ["eggs", "milk", "flour"],
    days: [],
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
    days: [0],
  },
]

export const RecipesPage = () => {
  const [assignDay, setAssignDay] = useState(false)
  const editDisclosure = useDisclosure()
  const detailsDisclose = useDisclosure()
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>()
  const [recipes, setRecipes] = useState(initialRecipes)

  const today = new Date()
  today.getDay()

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

  const handleClickDay = (day: number) => {
    setRecipes((old) =>
      old.map((r) =>
        r.id === selectedRecipe?.id
          ? { ...r, days: [...(r.days ?? []), day] }
          : r
      )
    )
    setSelectedRecipe(undefined)
    setAssignDay(false)
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
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon />}
              variant="outline"
            />
            <MenuList>
              <MenuItem icon={<DeleteIcon />}>Clear week</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
        <List spacing={4} mb={10}>
          {days.map((day, i) => (
            <ListItem key={day.name}>
              {assignDay ? (
                <Button
                  variant="solid"
                  colorScheme="blue"
                  onClick={() => handleClickDay(i)}
                >
                  {day.name}
                </Button>
              ) : (
                <Heading size="sm">{day.name}</Heading>
              )}
              {day.recipes.map((recipe) => (
                <Card
                  key={recipe.id}
                  cursor="pointer"
                  onClick={() => handleClickDetails(recipe)}
                >
                  <CardBody>
                    <Flex>
                      <Box flex={1}>
                        <Text>{recipe.name}</Text>
                        <Text fontSize="sm">
                          {recipe.ingredients.join(", ")}
                        </Text>
                      </Box>
                    </Flex>
                  </CardBody>
                </Card>
              ))}
            </ListItem>
          ))}
        </List>

        <Heading size="md" mb={4}>
          Recipes
        </Heading>
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
                cursor="pointer"
                onClick={() => handleClickDetails(recipe)}
              >
                <CardBody>
                  <Flex>
                    <Box flex={1}>
                      <Text>{recipe.name}</Text>
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
