import { Link } from "react-router-dom"

import classes from "./RegisteredSplash.module.css"

export function RegisteredSplash() {
  return (
    <article>
      <ListSummary />
      <MealPlanningSummary />
    </article>
  )
}

function ListSummary() {
  return (
    <section className={classes.section}>
      <div>You have 15 items in Shopping</div>
      <Link to="/list">Go to list</Link>
    </section>
  )
}

function MealPlanningSummary() {
  return (
    <section className={classes.section}>
      <div>You've planned meals for 3 days this week</div>
      <Link to="/planning">Go to meal planning</Link>
    </section>
  )
}
