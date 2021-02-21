import classes from "./GoogleLoginButton.module.css"

type GoogleLoginButtonProps = {
  onClick?: () => void
}

export default function GoogleLoginButton(props: GoogleLoginButtonProps) {
  const { onClick } = props

  return (
    <div onClick={onClick} className={classes.googleBtn} role="button">
      <div className={classes.googleIconWrapper}>
        <img
          className={classes.googleIcon}
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
          alt="Google logo"
        />
      </div>
      <p className={classes.btnText}>
        <b>Sign in with google</b>
      </p>
    </div>
  )
}
