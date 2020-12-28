export default interface Recipe {
  id: string
  name: string
  days: number[] | undefined
  recipeUrl?: string
  ingredients?: string[]
}
