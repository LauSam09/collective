import { useAuthentication } from "@/hooks";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";

export const Settings = () => {
  const { user } = useAuthentication();

  return (
    <Box>
      <Heading size="md" mt={2} mb={4}>
        Settings
      </Heading>

      <Card>
        <CardHeader>User details</CardHeader>
        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Display name
              </Heading>
              <Text pt="2" fontSize="sm">
                {user?.displayName}
              </Text>
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Email address
              </Heading>
              <Text pt="2" fontSize="sm">
                {user?.email}
              </Text>
            </Box>
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );
};
