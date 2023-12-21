import { HamburgerIcon } from "@chakra-ui/icons";
import { Box, Checkbox, Flex, IconButton, Text } from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import { logEvent } from "firebase/analytics";

import { Item as ItemModel } from "../../models/item";

import { useFirebase, useAuthentication } from "../../hooks";

export type ItemProps = {
  item: ItemModel;
  openDetails: () => void;
};

export const Item = (props: ItemProps) => {
  const {
    item: { id, name, completed, notes },
    openDetails,
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

  return (
    <Flex key={name} justifyContent="space-between">
      <Checkbox
        onChange={handleCheckboxChange}
        isChecked={completed}
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
      <IconButton aria-label="Open item details" onClick={openDetails}>
        <HamburgerIcon />
      </IconButton>
    </Flex>
  );
};
