import { faCheck, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type IngredientProps = {
  name: string
  added: boolean
  toggle: () => void
}

export function Ingredient(props: IngredientProps) {
  const { added, name, toggle } = props

  return (
    <div>
      {name}
      <button onClick={toggle}>
        <FontAwesomeIcon icon={added ? faCheck : faPlus} />
      </button>
    </div>
  )
}
