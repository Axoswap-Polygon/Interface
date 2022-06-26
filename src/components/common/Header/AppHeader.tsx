import {
  Flex,
  Link,
  Image,
  HStack,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { appRoutes } from "../../../routes";
import ThemeToggler from "../ThemeToggler";

const AppHeader = () => {
  const router = useRouter();

  return (
    <Flex
      position="fixed"
      w="100%"
      justify="space-between"
      align="center"
      p={5}
      bg={useColorModeValue("gray.50", "blackAlpha.400")}
      boxShadow="sm"
    >
      <HStack gap={4}>
        <NextLink href="/app/swap" passHref>
          <Link>
            <Image width={50} src="/assets/images/logo@2x.png" />
          </Link>
        </NextLink>

        <HStack
          display={{ base: "none", lg: "flex" }}
          fontSize={22}
          gap={10}
          mx={10}
          justify="center"
        >
          {appRoutes.map((route) => {
            const isActive = router.pathname === route.href;

            return (
              <NextLink href={route.href} passHref>
                <Link color={isActive ? "brand.300" : undefined}>
                  {route.label}
                </Link>
              </NextLink>
            );
          })}
        </HStack>
      </HStack>

      <HStack gap={2}>
        <Button variant="brand-2">Connect Wallet</Button>
        <ThemeToggler />
      </HStack>
    </Flex>
  );
};

export default AppHeader;
