import type { NextPageWithLayout } from "../_app";
import {
  Heading,
  VStack,
  Text,
  Stack,
  Divider,
  HStack,
  FormControl,
  FormLabel,
  Switch,
  useBoolean,
  useColorModeValue,
} from "@chakra-ui/react";
import Layout from "../../components/app/Layout";
import useMasterChefOwner from "../../hooks/useMasterChefOwner";
import { useWeb3React } from "@web3-react/core";
import AddLPButton from "../../components/app/Farm/AddLPButton";
import FarmBox from "../../components/app/Farm/FarmBox";
import useFarms from "../../hooks/useFarms";
import UpdatePoolsButton from "../../components/app/Farm/UpdatePoolsButton";

const Farm: NextPageWithLayout = () => {
  const [stakedOnly, setStakedOnly] = useBoolean();
  const { account } = useWeb3React();
  const { data: farms } = useFarms(stakedOnly ? account : undefined);

  const masterChefOwner = useMasterChefOwner();

  return (
    <VStack gap={5} w="full">

    <VStack
      bg={useColorModeValue("white", "gray.900")}
      boxShadow="lg"
      borderRadius="lg"
      p={4}
      gap={14}
      w="full"
    >
      <Heading
        size="3xl"
        fontWeight="light"
        textTransform="uppercase"
        letterSpacing="widest"
      >
        Liquidity Pool
      </Heading>
      <Text fontSize="m">
          Stake your LPs here to earn AXO block reward.
      </Text>
      <Stack
        direction={{ base: "column", lg: "row" }}
        gap={2}
        align="stretch"
        w="full"
      >
        {masterChefOwner && masterChefOwner === account ? (
          <AddLPButton />
        ) : null}
        <UpdatePoolsButton />
      </Stack>

      <VStack gap={5} w="full">
        <HStack align="stretch" w="full" gap={2}>
          <Heading alignSelf="flex-start" size="lg" mb={2}>
            Farms
          </Heading>
          <FormControl display="flex" alignItems="center" gap={2}>
            <Switch
              size="lg"
              isChecked={stakedOnly}
              onChange={setStakedOnly.toggle}
            />
            <FormLabel fontSize="lg" mb="0">
              Staked only
            </FormLabel>
          </FormControl>
        </HStack>

        <Divider />

        {!farms || farms.length === 0 ? (
          <Text
            textAlign="center"
            variant="subtext"
            w="full"
            py={4}
            borderRadius="lg"
            border="solid"
            borderWidth={1}
            borderColor="gray.200"
            overflow="hidden"
          >
            {!farms ? "Loading..." : "No Farm found"}
          </Text>
        ) : (
          farms.map((farm) => <FarmBox key={farm.lpToken} farm={farm} />)
        )}
      </VStack>
    </VStack>
    </VStack>
  );
};

Farm.getLayout = Layout;

export default Farm;
