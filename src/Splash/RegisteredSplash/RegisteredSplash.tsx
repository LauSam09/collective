import { Link } from "react-router-dom"

import classes from "./RegisteredSplash.module.css"

interface RegisteredSplashProps {
  itemCount: number
  planCount: number
}

export const RegisteredSplash = (props: RegisteredSplashProps) => {
  const { itemCount, planCount } = props

  return (
    <article>
      <ListSummary itemCount={itemCount} />
      <RecipeSummary planCount={planCount} />
    </article>
  )
}

interface ListSummaryProps {
  itemCount: number
}

const ListSummary = (props: ListSummaryProps) => {
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

interface RecipeSummaryProps {
  planCount: number
}

const RecipeSummary = (props: RecipeSummaryProps) => {
  const { planCount } = props

  return (
    <section className={classes.section}>
      <div>
        You've planned meals for {planCount} day{planCount === 1 ? null : "s"}{" "}
        this week
      </div>
      <Link to="/recipes">Go to recipes & meal planning</Link>
    </section>
  )
}
