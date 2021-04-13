import { Link } from "react-router-dom"

import classes from "./RegisteredSplash.module.css"

type RegisteredSplashProps = {
  itemCount: number
  planCount: number
}

export function RegisteredSplash(props: RegisteredSplashProps) {
  const { itemCount, planCount } = props

  return (
    <article>
      <ListSummary itemCount={itemCount} />
      <RecipeSummary planCount={planCount} />
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

type RecipeSummaryProps = {
  planCount: number
}

function RecipeSummary(props: RecipeSummaryProps) {
  const { planCount } = props

  return (
    <section className={classes.section}>
      <div>You've planned meals for {planCount} days this week</div>
      <Link to="/recipes">Go to recipes & meal planning</Link>
    </section>
  )
}
