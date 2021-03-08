import { faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import classes from "./AddItem.module.css"

export function AddItem() {
  return (
    <form onSubmit={(e) => e.preventDefault()} className={classes.form}>
      <div className={classes.container}>
        <input placeholder="Name #category" />
        <button
          style={{
            backgroundColor: "#dedede",
          }}
        >
          <FontAwesomeIcon icon={faBars} size="2x" />
        </button>
      </div>
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
