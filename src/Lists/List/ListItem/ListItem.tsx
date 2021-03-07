import { faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { Category, Item } from "../../models"

import classes from "./ListItem.module.css"

export type ListItemProps = {
  item: Item
  category: Category | undefined
}

export function ListItem(props: ListItemProps) {
  const { item, category } = props

  function hexToRgb(hex: string) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    hex = hex.replace(shorthandRegex, function (_m, r, g, b) {
      return r + r + g + g + b + b
    })

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null
  }

  const getComplementaryColour = (hexColour: string) => {
    const { r, g, b } = hexToRgb(hexColour) || {}
    if (!r || !g || !b) {
      return "inherit"
    }

    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "black" : "white"
  }

  return (
    <div className={classes.container}>
      <input type="checkbox" checked={item.completed} />
      <div className={classes.details}>
        <span>{item.name}</span>
        <small>{item.notes}</small>
      </div>
      <button
        style={{
          backgroundColor: category?.colour || "inherit",
          color: getComplementaryColour(category?.colour || ""),
        }}
      >
        <FontAwesomeIcon icon={faBars} size="2x" />
      </button>
    </div>
  )
}
