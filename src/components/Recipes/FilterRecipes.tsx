import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import {
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { FilterIcon } from "../icons";

export type FilterRecipesProps = {
  filterValue: string;
  onUpdateFilterValue: (filterValue: string) => void;
  onClearSearch: () => void;
};

export const FilterRecipes = (props: FilterRecipesProps) => {
  const { filterValue, onUpdateFilterValue, onClearSearch } = props;

  return (
    <Flex gap={1}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Search by name or ingredient"
          value={filterValue}
          onChange={(e) => onUpdateFilterValue(e.target.value)}
        />
        <InputRightElement>
          <IconButton
            size="sm"
            variant="ghost"
            aria-label="Clear recipe search"
            onClick={onClearSearch}
          >
            <CloseIcon />
          </IconButton>
        </InputRightElement>
      </InputGroup>
      <IconButton icon={<FilterIcon />} aria-label="Filter" />
    </Flex>
  );
};
