import {
  HamburgerIcon,
  EditIcon,
  DeleteIcon,
  InfoIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Checkbox,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";

import { Item as ItemModel } from "../../models/item";

export type ItemProps = {
  item: ItemModel;
  openDetails: () => void;
  openEdit: () => void;
};

export const Item = (props: ItemProps) => {
  const {
    item: { name, completed, notes },
    openDetails,
    openEdit,
  } = props;

  return (
    <Flex key={name} justifyContent="space-between">
      <Checkbox
        defaultChecked={completed}
        size="lg"
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
        className="list-checkbox"
        flex={1}
      >
        <Box color={completed ? "gray.500" : "default"}>
          <Text as={completed ? "s" : "p"} display="inline">
            {name}
          </Text>
          {notes && (
            <Text fontSize="xs" ml="1" display="inline">
              - {notes}
            </Text>
          )}
        </Box>
      </Checkbox>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<HamburgerIcon />}
          variant="solid"
        />
        <MenuList>
          <MenuItem icon={<InfoIcon />} onClick={openDetails}>
            Details
          </MenuItem>
          <MenuItem icon={<EditIcon />} onClick={openEdit}>
            Edit
          </MenuItem>
          <MenuItem icon={<DeleteIcon />}>Delete</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};
