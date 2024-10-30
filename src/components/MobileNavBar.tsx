import {
  AddIcon,
  CalendarIcon,
  CheckIcon,
  SearchIcon,
  SettingsIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  HStack,
  Link,
  Show,
  useColorModeValue,
} from "@chakra-ui/react";
import { NavLink, NavLinkProps } from "react-router-dom";

export const MobileNavBar = () => {
  const backgroundColor = useColorModeValue("gray.100", "gray.700");

  return (
    <Show below="sm">
      {/* Prevent mobile nav bar from overlapping content at bottom of screen */}
      <Box py={7} />
      <Box
        position="fixed"
        bottom={0}
        p={1}
        width="100%"
        backgroundColor={backgroundColor}
      >
        <HStack alignItems="stretch" gap={1}>
          <MobileNavLink to="/">
            <CheckIcon />
          </MobileNavLink>

          <MobileNavLink to="/planning">
            <CalendarIcon />
          </MobileNavLink>

          <QuickAddButton />

          <MobileNavLink to="/recipes">
            <SearchIcon />
          </MobileNavLink>

          <MobileNavLink to="/settings">
            <SettingsIcon />
          </MobileNavLink>
        </HStack>
      </Box>
    </Show>
  );
};

type MobileNavLinkProps = Pick<NavLinkProps, "to"> & {
  children: React.ReactNode;
};

const MobileNavLink = ({ to, children }: MobileNavLinkProps) => (
  <Link
    as={NavLink}
    to={to}
    p={2}
    borderRadius="md"
    flex={1}
    display="flex"
    flexDir="column"
    alignItems="center"
    justifyContent="center"
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
    {children}
  </Link>
);

const QuickAddButton = () => (
  <Button
    colorScheme="blue"
    variant="solid"
    display="flex"
    flexDir="column"
    alignItems="center"
    justifyContent="center"
    flex={1}
    paddingY={4}
    aria-label="Add item"
    height="100%"
    fontWeight="normal"
    onClick={() => {}}
    _hover={{
      backgroundColor: "var(--chakra-colors-gray-200)",
    }}
    _dark={{
      _hover: {
        backgroundColor: "var(--chakra-colors-whiteAlpha-200)",
      },
    }}
  >
    <AddIcon />
  </Button>
);
