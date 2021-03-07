import { useListItems } from "../ListContext"
import { ListItem } from "./ListItem"

import classes from "./List.module.css"

export function List() {
  const addedItems = useListItems()

  return (
    <article>
      <section>
        {addedItems.length === 0 ? (
          <span>Nothing added yet!</span>
        ) : (
          <div className={classes.list}>
            {addedItems.map((item) => (
              <ListItem key={item.name} item={item} />
            ))}
          </div>
        )}
      </section>
    </article>
  )
}
