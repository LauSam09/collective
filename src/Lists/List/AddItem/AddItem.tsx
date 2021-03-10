import { Item } from "../Common/Item"

import classes from "./AddItem.module.css"

export function AddItem() {
  return (
    <form onSubmit={(e) => e.preventDefault()} className={classes.form}>
      <Item>
        <input />
      </Item>
      <div className={classes.actions}>
        <button type="button" className={classes.clear}>
          Clear
        </button>
        <button type="submit" className={classes.add}>
          Add
        </button>
      </div>
    </form>
  )
}
