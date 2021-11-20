import { GroupBase, OptionsOrGroups } from "react-select"
import Select from "react-select/dist/declarations/src/Select"

export type LoadOptionsCallback = (
  options: OptionsOrGroups<
    {
      label: string
      value: string
    },
    GroupBase<{
      label: string
      value: string
    }>
  >
) => void

export type SelectRef = Select<
  { label: string; value: string },
  false,
  GroupBase<{ label: string; value: string }>
>
