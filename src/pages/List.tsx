import { Box } from "@chakra-ui/react"
import { AddItem } from "../components/List/AddItem"

import { Categories } from "../components/List/Categories"

export const ListPage = () => (
  <Box>
    <Categories />
    <Box mb="12" />
    <AddItem />
  </Box>
)
