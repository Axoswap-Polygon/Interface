import {
  HStack,
  Box,
  Button,
  useDisclosure,
  Text,
  VStack,
  Collapse,
  Flex,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import useTokenInfo from "../../../hooks/useTokenInfo";
import { Liquidity } from "../../../types";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { parseBalance } from "../../../utils";
import RemoveLiquidityButton from "./RemoveLiquidityButton";

interface LiquidityBoxProps {
  liquidity: Liquidity;
}

const LiquidityBox = ({ liquidity }: LiquidityBoxProps) => {
  const { isOpen, onToggle } = useDisclosure();
  const token0Info = useTokenInfo(liquidity.token0);
  const token1Info = useTokenInfo(liquidity.token1);

  if (!token0Info || !token1Info) return null;

  return (
    <Box
      bg={useColorModeValue("brand.100", "brand.200")}
      w="full"
      p={4}
      borderRadius="lg"
    >
      <HStack justifyContent="space-between">
        <HStack gap={2}>
          <Flex fontSize="2xl">
            <token0Info.logo mr={1} />
            <token1Info.logo />
          </Flex>

          <Text fontSize="xl">
            {token0Info.symbol}/{token1Info.symbol}
          </Text>
        </HStack>
        <Button
          onClick={onToggle}
          rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          variant="ghost"
        >
          Manage
        </Button>
      </HStack>
      <Collapse in={isOpen}>
        <VStack pt={5} gap={2} align="stretch">
          <HStack justify="space-between">
            <Text fontWeight="bold">Your total pool token:</Text>
            <Text>{parseBalance(liquidity.liquidityBalance, 18, 18)}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text fontWeight="bold">Pooled {token0Info.symbol}:</Text>
            <Text>{parseBalance(liquidity.amount0, token0Info.decimals)}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text fontWeight="bold">Pooled {token1Info.symbol}:</Text>
            <Text>{parseBalance(liquidity.amount1, token1Info.decimals)}</Text>
          </HStack>
        </VStack>

        <Divider my={2} />

        <HStack justify="end">
          <RemoveLiquidityButton liquidity={liquidity} />
        </HStack>
      </Collapse>
    </Box>
  );
};

export default LiquidityBox;