import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "@/firebase";

const auth = getAuth();

export const SignIn = () => {
  const signIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Stack minHeight="90vh" justifyContent="center">
      <Flex justifyContent="center" flexDir="row" width="100%" p={4}>
        <Card size="sm">
          <CardHeader>
            <Heading>Collective</Heading>
          </CardHeader>
          <CardBody>
            <Stack spacing="4">
              <Text>
                Welcome to Collective - the recipe planning application.
              </Text>
              <Text>Sign in to get started.</Text>
              <Button onClick={signIn}>Sign in with Google</Button>
            </Stack>
          </CardBody>
        </Card>
      </Flex>
    </Stack>
  );
};
