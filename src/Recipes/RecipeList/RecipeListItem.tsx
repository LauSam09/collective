import classes from "./RecipeListItem.module.css"

export type RecipeListItemProps = {
  name: string
}

export function RecipeListItem(props: RecipeListItemProps) {
  const { name } = props
  return (
    <li className={classes.recipe}>
      <span>{name}</span>
    </li>
  )
}
