import { HamburgerIcon, EditIcon, InfoIcon, MinusIcon } from "@chakra-ui/icons";
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
import { doc, updateDoc, increment } from "firebase/firestore";

import { Item as ItemModel } from "../../models/item";

import { useFirebase, useAuthentication } from "../../hooks";
import { logEvent } from "firebase/analytics";

export type ItemProps = {
  item: ItemModel;
  openDetails: () => void;
  openEdit: () => void;
};

export const Item = (props: ItemProps) => {
  const {
    item: { id, name, completed, notes },
    openDetails,
    openEdit,
  } = props;
  const { firestore, analytics } = useFirebase();
  const { appUser } = useAuthentication();

  const handleCheckboxChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const completed = e.target.checked;
    if (typeof completed !== "boolean") {
      return;
    }

    const itemRef = doc(
      firestore,
      "groups",
      appUser!.group.id,
      "lists",
      appUser!.group.defaultList,
      "items",
      id,
    );
    await updateDoc(itemRef, {
      completed,
    });

    logEvent(analytics, "toggle_completion", { completed });
  };

  const handleRemoveClick = async () => {
    const itemRef = doc(
      firestore,
      "groups",
      appUser!.group.id,
      "lists",
      appUser!.group.defaultList,
      "items",
      id,
    );

    await updateDoc(itemRef, {
      added: false,
      completed: false,
      notes: "",
      count: increment(-1),
    });

    logEvent(analytics, "item_removal");
  };

  return (
    <Flex key={name} justifyContent="space-between">
      <Checkbox
        onChange={handleCheckboxChange}
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
          <MenuItem icon={<MinusIcon />} onClick={handleRemoveClick}>
            Remove
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};
