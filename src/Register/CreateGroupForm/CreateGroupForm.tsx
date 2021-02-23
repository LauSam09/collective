import { useForm } from "react-hook-form"

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

  const { errors, isValid } = formState

  const createGroup = (data: Form) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(createGroup)}>
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
