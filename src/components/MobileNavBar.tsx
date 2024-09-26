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
import { NavLink } from "react-router-dom";

export const MobileNavBar = () => {
  const backgroundColor = useColorModeValue("gray.100", "gray.700");

  return (
    <Show below="sm">
      <Box
        position="fixed"
        bottom={0}
        p={1}
        width="100%"
        backgroundColor={backgroundColor}
      >
        <HStack alignItems="stretch" gap={1}>
          {/* TODO: Factor out these components */}
          <Link
            as={NavLink}
            to="/"
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
            <CheckIcon />
          </Link>
          <Link
            as={NavLink}
            to="/planning"
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
            <CalendarIcon />
          </Link>

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
          <Link
            as={NavLink}
            to="/recipes"
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
            <SearchIcon />
          </Link>
          <Link
            as={NavLink}
            to="/settings"
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
            <SettingsIcon />
          </Link>
        </HStack>
      </Box>
    </Show>
  );
};
