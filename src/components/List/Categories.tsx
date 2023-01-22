import { Skeleton, Stack, useDisclosure } from "@chakra-ui/react"
import { useState } from "react"
import { Item as ItemModel } from "../../models/item"
import { Category } from "./Category"
import { EditItemModal } from "./EditItemModal"
import { Item } from "./Item"
import { ItemDetailsModal } from "./ItemDetailsModal"

export const Categories = () => {
  const state = "Loading"
  const detailsDisclosure = useDisclosure()
  const editDisclosure = useDisclosure()
  const [selectedItem, setSelectedItem] = useState<ItemModel>()

  const categories = [
    {
      name: "Fruit & vegetables",
      colour: "#74ac72",
      items: [{ id: "1", name: "Bananas", complete: false, notes: undefined }],
    },
    {
      name: "Pantry",
      colour: "#969B96",
      items: [
        {
          id: "2",
          name: "Cereal",
          complete: true,
          notes: "Sophie and Laurence",
        },
      ],
    },
    {
      name: "Eggs & dairy",
      colour: "#fcf403",
      items: [{ id: "3", name: "Eggs", complete: false, notes: "Dozen" }],
    },
  ]

  const handleOpenDetails = (item: ItemModel) => {
    setSelectedItem(item)
    detailsDisclosure.onOpen()
  }

  const handleOpenEdit = (item: ItemModel) => {
    setSelectedItem(item)
    editDisclosure.onOpen()
  }

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
    <>
      <Stack>
        {categories.map((category) => (
          <Category key={category.name} {...category}>
            {category.items.map((item) => (
              <Item
                key={item.id}
                item={item}
                openDetails={() => handleOpenDetails(item)}
                openEdit={() => handleOpenEdit(item)}
              />
            ))}
          </Category>
        ))}
      </Stack>
      <ItemDetailsModal {...detailsDisclosure} item={selectedItem} />
      <EditItemModal {...editDisclosure} item={selectedItem} />
    </>
  )
}
