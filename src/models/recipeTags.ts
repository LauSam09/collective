export interface RecipeTag {
  id: string;
  name: string;
  type: string;
}

export const tags = [
  { id: "american", name: "American", type: "cuisine" },
  { id: "asian", name: "Asian", type: "cuisine" },
  { id: "greek", name: "Greek", type: "cuisine" },
  { id: "indian", name: "Indian", type: "cuisine" },
  { id: "italian", name: "Italian", type: "cuisine" },
  { id: "mexican", name: "Mexican", type: "cuisine" },
  { id: "middle_eastern", name: "Middle Eastern", type: "cuisine" },
  { id: "spanish", name: "Spanish", type: "cuisine" },

  { id: "breakfast", name: "Breakfast", type: "type" },
  { id: "baking", name: "Baking", type: "type" },
  { id: "dessert", name: "Dessert", type: "type" },
  { id: "light", name: "Light", type: "type" },
  { id: "rapid", name: "Rapid", type: "type" },
];

export const tagTypes = [
  { id: "cuisine", name: "Cuisine" },
  { id: "type", name: "Type" },
];
