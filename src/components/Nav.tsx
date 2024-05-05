import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Show,
  SkeletonCircle,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Link as RouterLink, NavLink } from "react-router-dom";
import {
  CalendarIcon,
  CheckIcon,
  HamburgerIcon,
  SearchIcon,
  SettingsIcon,
} from "@chakra-ui/icons";
import { useRef } from "react";

import { useAuthentication } from "@/hooks";
import { version } from "../../package.json";

export default function Nav() {
  const { state, user, signOut } = useAuthentication();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Box
        bg={useColorModeValue("gray.100", "gray.900")}
        px={4}
        position="sticky"
        top={0}
        zIndex={100}
      >
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Box>
            <Heading>
              <Show below="sm">
                <IconButton
                  variant="ghost"
                  onClick={onOpen}
                  ref={btnRef}
                  aria-label="Expand nav menu"
                  ml={-2}
                  mr={2}
                >
                  <HamburgerIcon boxSize={6} />
                </IconButton>
              </Show>
              <Link as={RouterLink} to="/">
                Collective
              </Link>
            </Heading>
          </Box>

          {state === "Authenticated" && (
            <Flex alignItems="center">
              <Stack direction="row" spacing={4} alignItems="center">
                <Show above="sm">
                  <Link as={NavLink} to="/">
                    List
                  </Link>
                  <Link as={NavLink} to="/planning">
                    Planning
                  </Link>
                  <Link as={NavLink} to="/recipes">
                    Recipes
                  </Link>
                </Show>
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded="full"
                    variant="link"
                    cursor="pointer"
                    minW={0}
                  >
                    <Avatar size={"sm"} src={user?.photoURL ?? undefined} />
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
                      <Text fontSize="xs">Version {version}</Text>
                    </Flex>
                  </MenuList>
                </Menu>
              </Stack>
            </Flex>
          )}
          {state === "Loading" && <SkeletonCircle size="8" />}
        </Flex>
      </Box>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <Stack p={2}>
            <Heading>
              <Link as={RouterLink} to="/" onClick={onClose}>
                Collective
              </Link>
            </Heading>
            <Link
              as={NavLink}
              to="/"
              p={2}
              onClick={onClose}
              borderRadius="md"
              _hover={{
                textDecor: "none",
                backgroundColor: "var(--chakra-colors-gray-200)",
              }}
              _dark={{
                _hover: {
                  backgroundColor: "var(--chakra-colors-whiteAlpha-200)",
                },
                _activeLink: {
                  backgroundColor: "var(--chakra-colors-whiteAlpha-200)",
                },
              }}
              _activeLink={{
                backgroundColor: "var(--chakra-colors-gray-200)",
              }}
            >
              <CheckIcon /> List
            </Link>
            <Link
              as={NavLink}
              to="/planning"
              p={2}
              borderRadius="md"
              onClick={onClose}
              _hover={{
                textDecor: "none",
                backgroundColor: "var(--chakra-colors-gray-200)",
              }}
              _dark={{
                _hover: {
                  backgroundColor: "var(--chakra-colors-whiteAlpha-200)",
                },
                _activeLink: {
                  backgroundColor: "var(--chakra-colors-whiteAlpha-200)",
                },
              }}
              _activeLink={{
                backgroundColor: "var(--chakra-colors-gray-200)",
              }}
            >
              <CalendarIcon /> Planning
            </Link>
            <Link
              as={NavLink}
              to="/recipes"
              p={2}
              onClick={onClose}
              borderRadius="md"
              _hover={{
                textDecor: "none",
                backgroundColor: "var(--chakra-colors-gray-200)",
              }}
              _dark={{
                _hover: {
                  backgroundColor: "var(--chakra-colors-whiteAlpha-200)",
                },
                _activeLink: {
                  backgroundColor: "var(--chakra-colors-whiteAlpha-200)",
                },
              }}
              _activeLink={{
                backgroundColor: "var(--chakra-colors-gray-200)",
              }}
            >
              <SearchIcon /> Recipes
            </Link>
            <Link
              as={NavLink}
              to="/settings"
              p={2}
              onClick={onClose}
              borderRadius="md"
              _hover={{
                textDecor: "none",
                backgroundColor: "var(--chakra-colors-gray-200)",
              }}
              _dark={{
                _hover: {
                  backgroundColor: "var(--chakra-colors-whiteAlpha-200)",
                },
                _activeLink: {
                  backgroundColor: "var(--chakra-colors-whiteAlpha-200)",
                },
              }}
              _activeLink={{
                backgroundColor: "var(--chakra-colors-gray-200)",
              }}
            >
              <SettingsIcon /> Settings
            </Link>
          </Stack>
        </DrawerContent>
      </Drawer>
    </>
  );
}
