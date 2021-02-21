import classes from "./Features.module.css"

export default function Features() {
  return (
    <div className={classes.features}>
      <h4>Features</h4>
      <ul>
        <li>
          Add items to your shared household shopping list with real-time
          updates
        </li>
        <li>Categorise items to make shopping easier</li>
        <li>
          Works entirely offline and will synchronise with your household when
          you're next online
        </li>
        <li>Bookmark recipes that you don't want to forget</li>
        <li>
          Save ingredients that can then be quickly added to your shopping list
        </li>
      </ul>
    </div>
  )
}
