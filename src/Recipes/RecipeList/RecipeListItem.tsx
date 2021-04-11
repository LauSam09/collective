import classes from "./RecipeListItem.module.css"

export type RecipeListItemProps = {
  name: string
  onClick?: () => void
}

export function RecipeListItem(props: RecipeListItemProps) {
  const { name, onClick } = props
  return (
    <div onClick={onClick} className={classes.recipe}>
      <span>{name}</span>
    </div>
  )
}
