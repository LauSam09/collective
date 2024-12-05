import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Heading,
  IconButton,
  Link,
  Stack,
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
import { AvatarFallback } from "@radix-ui/react-avatar";

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

export function NavBar() {
  const { user, signOut } = useAuth();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <div className="px-4 sticky z-[49] top-0 bg-gray-100 dark:bg-gray-900">
        <div className="h-16 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              <div className="sm:hidden inline-block">
                <IconButton
                  variant="ghost"
                  onClick={onOpen}
                  ref={btnRef}
                  aria-label="Expand nav menu"
                  ml={-2}
                  mr={2}
                  className="sm:hidden"
                >
                  <HamburgerIcon boxSize={6} />
                </IconButton>
              </div>
              <RouterLink to="/">Collective</RouterLink>
            </h1>
          </div>

          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2">
                <NavLink to="/">List</NavLink>
                <NavLink to="/planning">Planning</NavLink>
                <NavLink to="/recipes">Recipes</NavLink>
                <NavLink to="/settings">Settings</NavLink>
              </div>

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
            </div>
          </div>
        </div>
      </div>
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
