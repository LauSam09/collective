import { HamburgerIcon, EditIcon, DeleteIcon, InfoIcon } from "@chakra-ui/icons"
import {
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react"

type CategoryProps = {
  colour: string
  name: string
}

const Category = (props: CategoryProps) => {
  const { colour, name } = props

  const items = [
    {
      name: "Cheddar",
      complete: false,
      notes: "if on special",
    },
    { name: "Milk", complete: true },
  ]

  return (
    <Card backgroundColor={`${colour}75`}>
      <CardHeader>
        <Heading size="xs">{name.toLocaleUpperCase()}</Heading>
      </CardHeader>
      <CardBody>
        <Stack gap={2}>
          {items.map((item) => (
            <Flex key={item.name} justifyContent="space-between">
              <Checkbox
                defaultChecked={item.complete}
                size="lg"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                className="list-checkbox"
                flex={1}
              >
                {item.name}
                {item.notes && (
                  <Text fontSize="xs" ml="1" display="inline">
                    - {item.notes}
                  </Text>
                )}
              </Checkbox>
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<HamburgerIcon />}
                  variant="solid"
                />
                <MenuList>
                  <MenuItem icon={<InfoIcon />}>Details</MenuItem>
                  <MenuItem icon={<EditIcon />}>Edit</MenuItem>
                  <MenuItem icon={<DeleteIcon />}>Delete</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          ))}
        </Stack>
      </CardBody>
    </Card>
  )
}

export const Categories = () => {
  const state = "Loading"

  const categories = [
    {
      name: "Fruit & vegetables",
      colour: "#74ac72",
    },
    {
      name: "Pantry",
      colour: "#969B96",
    },
    {
      name: "Eggs & dairy",
      colour: "#fcf403",
    },
  ]

  if (state !== "Loading") {
    return (
      <Stack>
        {[
          { name: "", colour: "" },
          { name: "", colour: "" },
          { name: "", colour: "" },
        ].map((category, i) => (
          <Skeleton key={i}>
            <Category {...category} />
          </Skeleton>
        ))}
      </Stack>
    )
  }

  return (
    <Stack>
      {categories.map((category) => (
        <Category key={category.name} {...category} />
      ))}
    </Stack>
  )
}
