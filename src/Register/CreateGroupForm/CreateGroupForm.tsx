import { useForm } from "react-hook-form"

import { useUser, useUserContext } from "Authentication"
import { FullPageSpinner } from "Common"

import { createGroup } from "./CreateGroupForm.service"

import classes from "./CreateGroupForm.module.css"

type Form = {
  name: string
}

export function CreateGroupForm() {
  const { formState, handleSubmit, register } = useForm<Form>({
    defaultValues: {
      name: "",
    },
    mode: "onChange",
  })
  const { setUserGroup } = useUserContext()
  const user = useUser()

  if (!user) {
    throw new Error("Must be authenticated to use CreateGroupForm")
  }

  const { errors, isValid, isSubmitting } = formState

  async function handleCreateGroup(data: Form) {
    if (!user) {
      throw new Error("Should not be able to create group if user is undefined")
    }

    const group = await createGroup(data.name, user.id, user.displayName)
    setUserGroup(group)
  }

  return (
    <>
      {isSubmitting ? <FullPageSpinner /> : null}
      <div>
        <p>
          If you're the first in your household to sign up, then create a new
          household below.
        </p>
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
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={classes.submit}
          >
            Create
          </button>
        </form>
      </div>
    </>
  )
}
