import { Modal } from "Common"

type RecipeModalProps = {
  isOpen: boolean
  close: () => void
}

export function RecipeModal(props: RecipeModalProps) {
  const { isOpen, close } = props

  return <Modal isOpen={isOpen} onRequestClose={close} />
}
