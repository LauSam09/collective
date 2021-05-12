import { useEffect, useState } from "react"

interface FilterRecipesProps {
  onFilterChange: (filter: string) => void
}

export const FilterRecipes = (props: FilterRecipesProps) => {
  const { onFilterChange } = props
  const [filter, setFilter] = useState("")

  useEffect(() => {
    onFilterChange(filter)
  }, [filter, onFilterChange])

  return (
    <input
      placeholder="Search..."
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
    />
  )
}
