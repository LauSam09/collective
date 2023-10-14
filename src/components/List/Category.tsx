import { Card, CardBody, CardHeader, Heading, Stack } from "@chakra-ui/react";
import React from "react";
import { ReactNode } from "react";

export type CategoryProps = {
  colour: string;
  name: string;
  children?: ReactNode;
};

export const Category = (props: CategoryProps) => {
  const { colour, name, children } = props;

  return (
    <Card>
      <CardHeader backgroundColor={`${colour}75`}>
        <Heading size="xs">{name.toLocaleUpperCase()}</Heading>
      </CardHeader>
      {React.Children.count(children) > 0 && (
        <CardBody backgroundColor={`${colour}50`}>
          <Stack gap={2}>{children}</Stack>
        </CardBody>
      )}
    </Card>
  );
};
