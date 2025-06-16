import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

const cuisineTags = [
  { id: "american", name: "American" },
  { id: "asian", name: "Asian" },
  { id: "greek", name: "Greek" },
  { id: "indian", name: "Indian" },
  { id: "italian", name: "Italian" },
  { id: "mexican", name: "Mexican" },
  { id: "middle_eastern", name: "Middle Eastern" },
  { id: "spanish", name: "Spanish" },
];

const typeTags = [
  { id: "breakfast", name: "Breakfast" },
  { id: "baking", name: "Baking" },
  { id: "dessert", name: "Dessert" },
  { id: "light", name: "Light" },
  { id: "rapid", name: "Rapid" },
];

export type SearchFiltersModalProps = {
  selectedCuisineTags: Array<string>;
  selectedTypeTags: Array<string>;
  setCuisineTags: (tags: Array<string>) => void;
  setTypeTags: (tags: Array<string>) => void;
};

export const SearchFiltersModal = (props: SearchFiltersModalProps) => {
  const [open, setOpen] = useState(false);
  const [selectedCuisineTags, setSelectedCuisineTags] = useState<string[]>(
    props.selectedCuisineTags,
  );
  const [selectedTypeTags, setSelectedTypeTags] = useState<string[]>([]);

  useEffect(() => {
    setSelectedCuisineTags(props.selectedCuisineTags);
    setSelectedTypeTags(props.selectedTypeTags);
  }, [open, props.selectedCuisineTags]);

  const handleCuisineTagClick = (tagId: string) => {
    if (selectedCuisineTags.includes(tagId)) {
      setSelectedCuisineTags(selectedCuisineTags.filter((id) => id !== tagId));
    } else {
      setSelectedCuisineTags([...selectedCuisineTags, tagId]);
    }
  };

  const handleTypeTagClick = (tagId: string) => {
    if (selectedTypeTags.includes(tagId)) {
      setSelectedTypeTags(selectedTypeTags.filter((id) => id !== tagId));
    } else {
      setSelectedTypeTags([...selectedTypeTags, tagId]);
    }
  };

  const handleApplyFilters = () => {
    props.setCuisineTags(selectedCuisineTags);
    props.setTypeTags(selectedTypeTags);
    setOpen(false);
  };

  const handleClearFiltersClick = () => {
    props.setCuisineTags([]);
    props.setTypeTags([]);
    setOpen(false);
  };

  const filteringApplied =
    props.selectedCuisineTags.length > 0 || props.selectedTypeTags.length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant={filteringApplied ? "default" : "secondary"}
          type="button"
        >
          <Filter />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter recipes</DialogTitle>
          <DialogDescription>
            In addition to searching by name or ingredients, you can filter
            recipes by tags you have applied to them.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div>
            <h3 className="text-sm font-medium">Cuisine</h3>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {cuisineTags.map((tag) =>
                selectedCuisineTags.includes(tag.id) ? (
                  <Button
                    key={tag.id}
                    variant="default"
                    size="sm"
                    onClick={() => handleCuisineTagClick(tag.id)}
                  >
                    {tag.name}
                  </Button>
                ) : (
                  <Button
                    key={tag.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleCuisineTagClick(tag.id)}
                  >
                    {tag.name}
                  </Button>
                ),
              )}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium">Type</h3>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {typeTags.map((tag) =>
                selectedTypeTags.includes(tag.id) ? (
                  <Button
                    key={tag.id}
                    variant="default"
                    size="sm"
                    onClick={() => handleTypeTagClick(tag.id)}
                  >
                    {tag.name}
                  </Button>
                ) : (
                  <Button
                    key={tag.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleTypeTagClick(tag.id)}
                  >
                    {tag.name}
                  </Button>
                ),
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            type="button"
            onClick={handleClearFiltersClick}
          >
            Clear filters
          </Button>
          <Button type="button" onClick={handleApplyFilters}>
            Apply filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
