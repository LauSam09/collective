import {
    Avatar,
    Box,
    Button,
    Center,
    Flex,
    Heading,
    Link,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    SkeletonCircle,
    Stack,
    Text,
    useColorModeValue,
} from "@chakra-ui/react"
import {Link as RouterLink, NavLink} from "react-router-dom"

import {useAuthentication} from "../hooks/useAuthentication"

export default function Nav() {
    const {state} = useAuthentication()

    return (
        <>
            <Box
                bg={useColorModeValue("gray.100", "gray.900")}
                px={4}
                position="sticky"
                top={0}
                zIndex={100}
            >
                <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
                    <Box>
                        <Heading>
                            <Link as={RouterLink} to="/">
                                Collective
                            </Link>
                        </Heading>
                    </Box>

                    <Flex alignItems={"center"}>
                        <Stack direction={"row"} spacing={4} alignItems={"center"}>
                            <Link as={NavLink} to="/">
                                List
                            </Link>
                            <Link as={NavLink} to="/recipes">
                                Recipes
                            </Link>
                            <Link as={NavLink} to="/planning">
                                Planning
                            </Link>
                            {state !== "Authenticated" ? (
                                <Menu>
                                    <MenuButton
                                        as={Button}
                                        rounded={"full"}
                                        variant={"link"}
                                        cursor={"pointer"}
                                        minW={0}
                                    >
                                        <Avatar size={"sm"} src={"Laurence"}/>
                                    </MenuButton>
                                    <MenuList alignItems={"center"}>
                                        <Center>
                                            <p>Laurence</p>
                                        </Center>
                                        <MenuDivider/>

                                        <MenuItem>Logout</MenuItem>
                                        <MenuDivider/>
                                        <Flex p={1} justifyContent="end">
                                            <Text fontSize="xs">Version 3.0.0</Text>
                                        </Flex>
                                    </MenuList>
                                </Menu>
                            ) : (
                                <SkeletonCircle/>
                            )}
                        </Stack>
                    </Flex>
                </Flex>
            </Box>
        </>
    )
}
