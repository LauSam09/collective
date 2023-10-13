import { Box, Button, Flex, Spinner } from "@chakra-ui/react"
import { Navigate } from "react-router-dom"

import { useAuthentication } from "../hooks/useAuthentication"

export const LoginPage = () => {
  const { state, signIn } = useAuthentication()

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
      <Button onClick={signIn}>Log in with Google</Button>
    </Box>
  )
}
