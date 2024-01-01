import { Box, Button, Flex, Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { useAuthentication } from "../hooks";

export const LoginPage = () => {
  const { state, signIn } = useAuthentication();
  const navigate = useNavigate();

  useEffect(() => {
    if (state === "Authenticated") {
      navigate("/");
    }
  }, [state, navigate]);

  if (state === "Loading") {
    return (
      <Flex align="center" justifyContent="center" height="80vh">
        <Spinner />
      </Flex>
    );
  }

  if (state === "Authenticated") {
    return null;
  }

  return (
    <Box textAlign="center">
      <Button onClick={signIn}>Log in with Google</Button>
    </Box>
  );
};
