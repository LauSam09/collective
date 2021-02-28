import { useForm } from "react-hook-form"

import classes from "./JoinGroupForm.module.css"

type Form = {
  joinKey: string
}

export function JoinGroupForm() {
  const { formState, register } = useForm<Form>({
    defaultValues: {
      joinKey: "",
    },
    mode: "onChange",
  })

  const { errors, isValid } = formState

  return (
    <div>
      <p>
        Alternatively, if someone else in your household has already signed up,
        then enter the key they've provided here.
      </p>
      <form>
        <div className={classes.formGroup}>
          <input
            name="joinKey"
            ref={register({ required: "You must provide a value" })}
          />
          <span className={classes.error}>
            {errors?.joinKey ? errors.joinKey.message : null}
          </span>
          <button className={classes.submit} disabled={!isValid} type="submit">
            Join
          </button>
        </div>
      </form>
    </div>
  )
}
