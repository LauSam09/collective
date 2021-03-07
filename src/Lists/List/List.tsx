import { useListCategories, useListItems } from "../ListContext"
import { ListItem } from "./ListItem"

import classes from "./List.module.css"

export function List() {
  const addedItems = useListItems()
  const categories = useListCategories()

  const groupedItems = categories.map((c) => ({
    ...c,
    items: addedItems.filter((i) => i.category === c.id),
  }))

  return (
    <article>
      <section>
        {addedItems.length === 0 ? (
          <span>Nothing added yet!</span>
        ) : (
          <div>
            {groupedItems.map((c) => (
              <div
                key={c.id}
                className={classes.category}
                style={{ backgroundColor: `${c.colour}40` }}
              >
                <small>{c.name.toLocaleUpperCase()}</small>
                <div className={classes.list}>
                  {c.items.map((item) => (
                    <ListItem key={item.name} item={item} category={c} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </article>
  )
}
