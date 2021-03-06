import { useListItems } from "../ListContext"
import { ListItem } from "./ListItem"

export function List() {
  const addedItems = useListItems()

  return (
    <article>
      <section>
        {addedItems.length === 0 ? (
          <span>Nothing added yet!</span>
        ) : (
          <div>
            {addedItems.map((item) => (
              <ListItem key={item.name} />
            ))}
          </div>
        )}
      </section>
    </article>
  )
}
