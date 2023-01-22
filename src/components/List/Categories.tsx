import { Skeleton, Stack } from "@chakra-ui/react"
import { Category } from "./Category"

export const Categories = () => {
  const state = "Loading"

  const categories = [
    {
      name: "Fruit & vegetables",
      colour: "#74ac72",
    },
    {
      name: "Pantry",
      colour: "#969B96",
    },
    {
      name: "Eggs & dairy",
      colour: "#fcf403",
    },
  ]

  if (state !== "Loading") {
    return (
      <Stack>
        {[
          { name: "", colour: "" },
          { name: "", colour: "" },
          { name: "", colour: "" },
        ].map((category, i) => (
          <Skeleton key={i}>
            <Category {...category} />
          </Skeleton>
        ))}
      </Stack>
    )
  }

  return (
    <Stack>
      {categories.map((category) => (
        <Category key={category.name} {...category} />
      ))}
    </Stack>
  )
}
