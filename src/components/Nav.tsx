import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { Link as RouterLink, NavLink } from "react-router-dom"

import { useAuthentication } from "../hooks/useAuthentication"

export default function Nav() {
  const { state, user, signOut } = useAuthentication()

  return (
    <>
      <Box
        bg={useColorModeValue("gray.100", "gray.900")}
        px={4}
        position="sticky"
        top={0}
        zIndex={100}
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box>
            <Heading>
              <Link as={RouterLink} to="/">
                Collective
              </Link>
            </Heading>
          </Box>

          {state === "Authenticated" && (
            <Flex alignItems={"center"}>
              <Stack direction={"row"} spacing={4} alignItems={"center"}>
                <Link as={NavLink} to="/">
                  List
                </Link>
                <Link as={NavLink} to="/planning">
                  Planning
                </Link>
                <Link as={NavLink} to="/recipes">
                  Recipes
                </Link>
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <Avatar size={"sm"} src={user?.displayName ?? "User"} />
                  </MenuButton>
                  <MenuList alignItems={"center"}>
                    <Flex px={3} direction="column">
                      <p>{user?.displayName}</p>
                      <small>{user?.email}</small>
                    </Flex>
                    <MenuDivider />
                    <MenuItem onClick={signOut}>Logout</MenuItem>
                    <MenuDivider />
                    <Flex px={2} justifyContent="end">
                      <Text fontSize="xs">Version 3.0.0</Text>
                    </Flex>
                  </MenuList>
                </Menu>
              </Stack>
            </Flex>
          )}
        </Flex>
      </Box>
    </>
  )
}
