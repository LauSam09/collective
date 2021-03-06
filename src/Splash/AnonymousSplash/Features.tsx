import classes from "./Features.module.css"

export function Features() {
  return (
    <div className={classes.features}>
      <h4>Features</h4>
      <ul>
        <li>Share shopping items in real-time</li>
        <li>Works entirely offline</li>
        <li>Bookmark recipes</li>
        <li>Save and quick-add ingredients</li>
      </ul>
    </div>
  )
}
