import { AddIcon } from "@chakra-ui/icons"
import { Box, Button } from "@chakra-ui/react"

import { Categories } from "../components/List/Categories"

export const ListPage = () => {
  return (
    <Box>
      <Categories />
      <Box mb="12" />
      <Button
        variant="solid"
        size="lg"
        position="fixed"
        colorScheme={"blue"}
        bottom="4"
        right="4"
        zIndex={10}
      >
        <AddIcon />
      </Button>
    </Box>
  )
}
