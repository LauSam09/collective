import { CalendarIcon, CheckIcon, SearchIcon } from "@chakra-ui/icons";
import { Box, HStack, Link, Show, useColorModeValue } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

export default function MobileNav() {
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
        <HStack>
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
            _hover={{
              textDecor: "none",
              backgroundColor: "var(--chakra-colors-gray-200)",
            }}
            _dark={{
              _hover: {
                backgroundColor: "var(--chakra-colors-whiteAlpha-300)",
              },
            }}
          >
            <CheckIcon /> List
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
            _hover={{
              textDecor: "none",
              backgroundColor: "var(--chakra-colors-gray-200)",
            }}
            _dark={{
              _hover: {
                backgroundColor: "var(--chakra-colors-whiteAlpha-300)",
              },
            }}
          >
            <CalendarIcon /> Planning
          </Link>
          <Link
            as={NavLink}
            to="/recipes"
            p={2}
            borderRadius="md"
            flex={1}
            display="flex"
            flexDir="column"
            alignItems="center"
            _hover={{
              textDecor: "none",
              backgroundColor: "var(--chakra-colors-gray-200)",
            }}
            _dark={{
              _hover: {
                backgroundColor: "var(--chakra-colors-whiteAlpha-300)",
              },
            }}
          >
            <SearchIcon />
            <span>Recipes</span>
          </Link>
        </HStack>
      </Box>
    </Show>
  );
}
