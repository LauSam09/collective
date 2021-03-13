import { Link } from "react-router-dom"

import classes from "./RegisteredSplash.module.css"

type RegisteredSplashProps = {
  itemCount: number
}

export function RegisteredSplash(props: RegisteredSplashProps) {
  const { itemCount } = props

  return (
    <article>
      <ListSummary itemCount={itemCount} />
      <MealPlanningSummary />
    </article>
  )
}

type ListSummaryProps = {
  itemCount: number
}

function ListSummary(props: ListSummaryProps) {
  const { itemCount } = props

  return (
    <section className={classes.section}>
      <div>
        You have {itemCount} item{itemCount === 1 ? null : "s"} in Shopping
      </div>
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
