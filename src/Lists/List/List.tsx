import { useListCategories, useListItems } from "../ListContext"
import { ListItem } from "./ListItem"

import classes from "./List.module.css"
import { AddItem } from "./AddItem"

export function List() {
  const addedItems = useListItems()
  const categories = useListCategories()
  const uncategorisedItems = addedItems.filter(
    (i) => !i.category || categories.findIndex((c) => c.id === i.category) < 0
  )
  const groupedItems = [...categories]
    .sort((a, b) => a.order - b.order)
    .map((c) => ({
      ...c,
      items: addedItems
        .filter((i) => i.category === c.id)
        .sort((a, b) => a.lowerName.localeCompare(b.lowerName)),
    }))

  if (uncategorisedItems.length > 0) {
    groupedItems.splice(0, 0, {
      name: "Uncategorised",
      order: -1,
      colour: "#dedede",
      items: uncategorisedItems.sort((a, b) =>
        a.lowerName.localeCompare(b.lowerName)
      ),
    })
  }

  return (
    <article>
      <section>
        <h2>Shopping</h2>
        <AddItem />
        {addedItems.length === 0 ? (
          <span>Nothing added yet!</span>
        ) : (
          <div className={classes.list}>
            {groupedItems.map((c) => (
              <div
                key={c.id}
                className={classes.category}
                style={{ backgroundColor: `${c.colour}40` }}
              >
                <small>{c.name.toLocaleUpperCase()}</small>
                <div className={classes.items}>
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
