import { useForm } from "react-hook-form"

import { useUser } from "Authentication"
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

  if (!user) {
    throw new Error("Must be authenticated to use CreateGroupForm")
  }

  const { errors, isValid } = formState

  return (
    <form
      onSubmit={handleSubmit((data: Form) =>
        createGroup({ ...data, users: [user.id] })
      )}
    >
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
