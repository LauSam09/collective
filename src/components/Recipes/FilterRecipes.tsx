import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import {
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  IconButton,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import { FilterIcon } from "../icons";
import { FilterRecipesModal } from "./FilterRecipesByTagModal";

export type FilterRecipesProps = {
  filterValue: string;
  filterTags: ReadonlyArray<string>;
  onUpdateFilterValue: (filterValue: string) => void;
  onUpdateFilterTags: (tags: ReadonlyArray<string>) => void;
  onClearSearch: () => void;
};

export const FilterRecipes = (props: FilterRecipesProps) => {
  const {
    filterTags,
    filterValue,
    onUpdateFilterValue,
    onClearSearch,
    onUpdateFilterTags,
  } = props;
  const filterDisclosure = useDisclosure();

  const handleUpdateFilterTags = (tags: ReadonlyArray<string>) => {
    onUpdateFilterTags(tags);
    filterDisclosure.onClose();
  };

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
      <IconButton
        icon={<FilterIcon />}
        onClick={() => filterDisclosure.onOpen()}
        aria-label="Filter"
        colorScheme={filterTags.length > 0 ? "blue" : undefined}
      />
      <FilterRecipesModal
        {...filterDisclosure}
        filterTags={filterTags}
        onUpdateFilterTags={handleUpdateFilterTags}
      />
    </Flex>
  );
};
