import { useForm } from "react-hook-form"

import { useGroupContext, useUser } from "Authentication"
import { createGroup } from "./CreateGroupForm.service"

import classes from "./CreateGroupForm.module.css"

type Form = {
  name: string
}

export default function CreateGroupForm() {
  const { formState, handleSubmit, register } = useForm<Form>({
    defaultValues: {
      name: "",
    },
    mode: "onChange",
  })
  const user = useUser()
  const { setGroup } = useGroupContext()

  if (!user) {
    throw new Error("Must be authenticated to use CreateGroupForm")
  }

  const { errors, isValid } = formState

  async function handleCreateGroup(data: Form) {
    const group = await createGroup({ ...data, users: [user?.id ?? ""] })
    setGroup && setGroup(group)
  }

  return (
    <form onSubmit={handleSubmit(handleCreateGroup)}>
      <div className={classes.formGroup}>
        <label htmlFor="name">Name*</label>
        <input
          id="name"
          name="name"
          ref={register({ required: "You must provide a name" })}
        />
        <span className={classes.error}>
          {errors?.name ? errors.name.message : null}
        </span>
      </div>
      <button type="submit" disabled={!isValid} className={classes.submit}>
        Create
      </button>
    </form>
  )
}
