import { faPlusCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useForm } from "react-hook-form"

import { useGroup } from "Authentication"

import classes from "./Household.module.css"

type Form = {
  userId: string
}

export function Household() {
  const { formState, handleSubmit, register } = useForm<Form>({
    defaultValues: {
      userId: "",
    },
    mode: "onChange",
  })
  const { errors, isValid, isSubmitting, isDirty } = formState

  function addUser(data: Form) {}

  return (
    <article>
      <h2>Household</h2>
      <dl>
        <dt>Name</dt>
        <dd>{useGroup()?.name}</dd>
      </dl>
      <h4 className={classes.subheading}>Add someone to your household</h4>
      <form onSubmit={handleSubmit(addUser)}>
        <div className={classes.userFormGroup}>
          <label htmlFor="userId">User Id</label>
          <input
            id="userId"
            name="userId"
            ref={register({
              minLength: { value: 28, message: "IDs are 28 characters long" },
              maxLength: { value: 28, message: "IDs are 28 characters long" },
            })}
          />
          <button
            className={classes.add}
            type="submit"
            disabled={!isValid || !isDirty || isSubmitting}
          >
            <FontAwesomeIcon icon={faPlusCircle} size="lg" />
          </button>
          <span className={classes.error}>
            {errors?.userId ? errors.userId.message : null}
          </span>
        </div>
      </form>
    </article>
  )
}
