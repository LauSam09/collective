export interface Recipe {
  id: string
  name: string
  days?: number[]
  recipeUrl?: string
  ingredients?: string[]
}

export interface DatabaseRecipe {
  name: string
  days?: number[]
  recipeUrl?: string
  ingredients?: string[]
}
