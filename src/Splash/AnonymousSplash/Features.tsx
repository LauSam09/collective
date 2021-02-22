import classes from "./Features.module.css"

export default function Features() {
  return (
    <div className={classes.features}>
      <h4>Features</h4>
      <ul>
        <li>Share shopping items in real-time</li>
        <li>Categorise items to make shopping easier</li>
        <li>Works entirely offline</li>
        <li>Bookmark recipes that you don't want to forget</li>
        <li>Save ingredients and quick-add ingredients</li>
      </ul>
    </div>
  )
}
