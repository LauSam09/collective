import classes from "./GoogleLoginButton.module.css"

interface GoogleLoginButtonProps {
  onClick?: () => void
}

export const GoogleLoginButton = (props: GoogleLoginButtonProps) => {
  const { onClick } = props

  return (
    <button onClick={onClick} className={classes.googleBtn}>
      Sign in through Google
    </button>
  )
}
