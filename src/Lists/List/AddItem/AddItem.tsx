import { faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import classes from "./AddItem.module.css"

export function AddItem() {
  return (
    <form className={classes.form}>
      <div className={classes.container}>
        <div className={classes.details}>
          <input placeholder="Name" />
          <input placeholder="Notes" />
        </div>
        <button
          style={{
            backgroundColor: "#dedede",
          }}
        >
          <FontAwesomeIcon icon={faBars} size="2x" />
        </button>
      </div>
      <div className={classes.submit}>
        <button className={classes.submit}>Add</button>
      </div>
    </form>
  )
}
