import { HamburgerIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons"
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
} from "@chakra-ui/react"
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
import { Text } from "@chakra-ui/react"
import { Recipe } from "../models/recipe"

const recipes: Array<Recipe> = [
  { id: "1", name: "Lasagne", ingredients: ["eggs", "milk", "flour"] },
  { id: "2", name: "Pancakes", ingredients: ["eggs", "milk", "flour"] },
  {
    id: "3",
    name: "Penne Arrabiata",
    ingredients: [
      "penne",
      "tomatoes",
      "garlic",
      "chilli flakes",
      "sugar",
      "parmesan",
    ],
  },
]

export const RecipesPage = () => {
  const today = new Date()
  today.getDay()

  return (
    <Box>
      <Box>
        <Tabs isFitted defaultIndex={today.getDay()}>
          <TabList>
            <Tab>S</Tab>
            <Tab>M</Tab>
            <Tab>T</Tab>
            <Tab>W</Tab>
            <Tab>T</Tab>
            <Tab>F</Tab>
            <Tab>S</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <p>Sunday</p>
            </TabPanel>
            <TabPanel>
              <p>Monday</p>
            </TabPanel>
            <TabPanel>
              <p>Tuesday</p>
            </TabPanel>
            <TabPanel>
              <p>Wednesday</p>
            </TabPanel>
            <TabPanel>
              <p>Thursday</p>
            </TabPanel>
            <TabPanel>
              <p>Friday</p>
            </TabPanel>
            <TabPanel>
              <p>Saturday</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      <Box>
        <Stack>
          {recipes.map((recipe) => (
            <Card key={recipe.id}>
              <CardBody>
                <Flex justifyContent="space-between">
                  <Box>
                    <Text>{recipe.name}</Text>
                    <Text fontSize="sm">{recipe.ingredients.join(", ")}</Text>
                  </Box>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="Options"
                      icon={<HamburgerIcon />}
                      variant="solid"
                    />
                    <MenuList>
                      <MenuItem icon={<EditIcon />}>Edit</MenuItem>
                      <MenuItem icon={<DeleteIcon />}>Delete</MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>
              </CardBody>
            </Card>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
