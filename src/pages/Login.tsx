import { Box, Button, Flex, Spinner } from "@chakra-ui/react"
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { Navigate } from "react-router-dom"

import { useAuthentication } from "../hooks/useAuthentication"

const provider = new GoogleAuthProvider()

export const LoginPage = () => {
  const { state } = useAuthentication()

  async function handleClick() {
    const user = await signInWithPopup(getAuth(), provider)
    console.log(user)
  }

  if (state === "Loading") {
    return (
      <Flex align="center" justifyContent="center" height="80vh">
        <Spinner />
      </Flex>
    )
  }

  if (state === "Authenticated") {
    // TODO: Improve to use returnUrl
    return <Navigate to="/" />
  }

  return (
    <Box textAlign="center">
      <Button onClick={handleClick}>Log in with Google</Button>
    </Box>
  )
}
