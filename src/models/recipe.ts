export interface Recipe {
  id: string
  name: string
  ingredients: ReadonlyArray<string>
  days?: ReadonlyArray<number>
  url?: string
  notes?: string
}
