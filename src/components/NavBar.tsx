import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  IconButton,
  Link,
  Show,
  Stack,
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

import { version } from "../../package.json";
import { useAuth } from "@/contexts";
import { Avatar, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AvatarFallback } from "@radix-ui/react-avatar";

export function NavBar() {
  const { user, signOut } = useAuth();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Box
        bg={useColorModeValue("gray.100", "gray.900")}
        px={4}
        position="sticky"
        top={0}
        zIndex={49}
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
                <Link as={NavLink} to="/settings">
                  Settings
                </Link>
              </Show>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage
                      src={user.photoUrl}
                      referrerPolicy="no-referrer"
                    />
                    <AvatarFallback>User</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="z-50">
                  <DropdownMenuLabel>
                    <div className="flex flex-col gap-0">
                      <span>{user.displayName}</span>
                      <span className="font-normal">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={signOut}
                    className="cursor-pointer"
                  >
                    Log out
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="flex justify-end">
                    <span className="text-xs">Version {version}</span>
                  </DropdownMenuLabel>
                </DropdownMenuContent>
              </DropdownMenu>
            </Stack>
          </Flex>
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
