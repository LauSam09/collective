export default interface Recipe {
  id: string
  name: string
  days: number[] | undefined // Undefined for backwards compatibility
}
