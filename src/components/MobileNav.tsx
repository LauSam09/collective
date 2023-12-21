import { AddIcon, CalendarIcon, CheckIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  HStack,
  Link,
  Show,
  useColorModeValue,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

import { useList } from "../hooks/useList";

export default function MobileNav() {
  const backgroundColor = useColorModeValue("gray.100", "gray.700");
  const { openAddItemModal } = useList();

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
          <Button
            variant="ghost"
            display="flex"
            flexDir="column"
            alignItems="center"
            flex={1}
            padding={2}
            aria-label="Add item"
            height="100%"
            fontWeight="normal"
            onClick={openAddItemModal}
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
            Add
          </Button>
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
                backgroundColor: "var(--chakra-colors-whiteAlpha-200)",
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
                backgroundColor: "var(--chakra-colors-whiteAlpha-200)",
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
                backgroundColor: "var(--chakra-colors-whiteAlpha-200)",
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
