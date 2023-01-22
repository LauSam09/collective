import { HamburgerIcon, EditIcon, DeleteIcon, InfoIcon } from "@chakra-ui/icons"
import {
  Box,
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
  Stack,
  Text,
} from "@chakra-ui/react"

export type CategoryProps = {
  colour: string
  name: string
}

export const Category = (props: CategoryProps) => {
  const { colour, name } = props

  const items = [
    {
      name: "Cheddar",
      complete: true,
      notes: "if on special",
    },
    { name: "Milk", complete: false },
  ]

  return (
    <Card>
      <CardHeader backgroundColor={`${colour}75`}>
        <Heading size="xs">{name.toLocaleUpperCase()}</Heading>
      </CardHeader>
      <CardBody backgroundColor={`${colour}50`}>
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
                <Box color={item.complete ? "gray.500" : "default"}>
                  <Text as={item.complete ? "s" : "p"}>{item.name}</Text>
                  {item.notes && (
                    <Text fontSize="xs" ml="1" display="inline">
                      - {item.notes}
                    </Text>
                  )}
                </Box>
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
