import type { NextPageWithLayout } from "../../_app";
import {
  useToast,
  VStack,
  Button,
  IconButton,
  HStack,
  Icon,
  Text,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import useFactoryContract from "../../../hooks/useFactoryContract";
import Layout from "../../../components/app/Layout";
import useRouterContract from "../../../hooks/useRouterContract";
import { useWeb3React } from "@web3-react/core";
import { Formik, Form, FormikErrors, FormikHelpers } from "formik";
import { LiquidityFormValues } from "../../../types";
import { amountWithSlippage, parseBalanceToBigNumber } from "../../../utils";
import LiquiditySelectToken from "../../../components/app/SelectToken/LiquiditySelectToken";
import { BiArrowBack } from "react-icons/bi";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { settingsAtom } from "../../../store";
import { BigNumber } from "ethers";

const initialValues: LiquidityFormValues = {
  token1: undefined,
  token2: undefined,
  token1Contract: null,
  token2Contract: null,
  token1Amount: undefined,
  token2Amount: undefined,
  token1Balance: undefined,
  token2Balance: undefined,
};

const AddLiquidity: NextPageWithLayout = () => {
  const [settings] = useAtom(settingsAtom);
  const toast = useToast();
  const router = useRouter();

  const routerContract = useRouterContract();
  const factoryContract = useFactoryContract();
  const { account, provider } = useWeb3React();
  const walletConnected =
    !!routerContract && !!factoryContract && !!account && !!provider;

  const handleAddLiquidity = async (
    {
      token1,
      token2,
      token1Amount,
      token2Amount,
      token1Contract,
      token2Contract,
    }: LiquidityFormValues,
    { resetForm }: FormikHelpers<LiquidityFormValues>
  ) => {
    if (
      !walletConnected ||
      !token1 ||
      !token2 ||
      !token1Amount ||
      !token2Amount ||
      !token1Contract ||
      !token2Contract
    )
      return;

    try {
      const amount1 = parseBalanceToBigNumber(token1Amount, token1.decimals);
      const amount2 = parseBalanceToBigNumber(token2Amount, token2.decimals);

      if (token1.isCoin || token2.isCoin) {
        const tokenContract = token1.isCoin ? token2Contract : token1Contract;
        const tokenAmount = token1.isCoin ? amount2 : amount1;
        const maticAmount = token1.isCoin ? amount1 : amount2;

        const tokenAllowance = await tokenContract.allowance(
          account,
          routerContract.address
        );

        if (tokenAllowance.lt(tokenAmount)) {
          let tx = await tokenContract.approve(
            routerContract.address,
            tokenAmount
          );
          await tx.wait();
        }

        const timestamp = (await provider.getBlock("latest")).timestamp;
        const deadline = timestamp + Number(settings.deadline) * 60;

        let gasLimit;

        try {
         gasLimit = await routerContract.estimateGas.addLiquidityETH(
          tokenContract.address,
          tokenAmount,
          amountWithSlippage(tokenAmount, settings.slippage),
          amountWithSlippage(maticAmount, settings.slippage),
          account,
          deadline,
         );
        } catch (err) {
          gasLimit = 3000000;
        }

        let tx = await routerContract.addLiquidityETH(
          tokenContract.address,
          tokenAmount,
          amountWithSlippage(tokenAmount, settings.slippage),
          amountWithSlippage(maticAmount, settings.slippage),
          account,
          deadline,
          {
            value: maticAmount,
            gasLimit
          },
        );

        await tx.wait();
      } else {
        const token1Allowance = await token1Contract.allowance(
          account,
          routerContract.address
        );

        const token2Allowance = await token2Contract.allowance(
          account,
          routerContract.address
        );

        if (token1Allowance.lt(amount1)) {
          let tx = await token1Contract.approve(
            routerContract.address,
            amount1
          );
          await tx.wait();
        }

        if (token2Allowance.lt(amount2)) {
          let tx = await token2Contract.approve(
            routerContract.address,
            amount2
          );
          await tx.wait();
        }

        const timestamp = (await provider.getBlock("latest")).timestamp;
        const deadline = timestamp + Number(settings.deadline) * 60;

        let gasLimit;
        try {
         gasLimit = await routerContract.estimateGas.addLiquidity(
          token1Contract.address,
          token2Contract.address,
          amount1,
          amount2,
          amountWithSlippage(amount1, settings.slippage),
          amountWithSlippage(amount2, settings.slippage),
          account,
          deadline,
          );
        } catch (err) {
          gasLimit = 3000000;
        }

        //TODO: set gasLimit
        let tx = await routerContract.addLiquidity(
          token1Contract.address,
          token2Contract.address,
          amount1,
          amount2,
          amountWithSlippage(amount1, settings.slippage),
          amountWithSlippage(amount2, settings.slippage),
          account,
          deadline,
          { gasLimit }
        );

        await tx.wait();
      }

      toast({
        title: "Add liquidity",
        description: "Liquidity added successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
      });

      resetForm();
    } catch (error: any) {
      toast({
        title: "Add liquidity",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const validator = ({
    token1,
    token2,
    token1Amount,
    token2Amount,
    token1Balance,
    token2Balance,
  }: LiquidityFormValues) => {
    const errors: FormikErrors<LiquidityFormValues> = {};
    if (!token1 || !token2) {
      errors.token1 = "Invalid token pair";
      return errors;
    }

    if (!token1Amount || !token2Amount) {
      errors.token1Amount = "Enter an amount";
      return errors;
    }

    if (
      token1Balance &&
      parseBalanceToBigNumber(token1Amount, token1.decimals).gt(token1Balance)
    ) {
      errors.token1Amount = `Insufficient ${token1.symbol} balance`;
    }

    if (
      token2Balance &&
      parseBalanceToBigNumber(token2Amount, token2.decimals).gt(token2Balance)
    ) {
      errors.token2Amount = `Insufficient ${token2.symbol} balance`;
    }

    return errors;
  };

  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      boxShadow="lg"
      borderRadius="lg"
      p={4}
    >
      <Formik
        validateOnMount
        validateOnChange
        initialValues={initialValues}
        validate={validator}
        onSubmit={handleAddLiquidity}
      >
        {({ handleSubmit, isSubmitting, isValid, errors }) => (
          <Form onSubmit={handleSubmit}>
            <VStack maxW={{ base: "250", sm: "sm", md: "md" }} gap={2}>
              <HStack fontSize="lg" alignSelf="flex-start">
                <IconButton
                  onClick={() => {
                    router.back();
                  }}
                  aria-label="back"
                  icon={<BiArrowBack />}
                />
                <Text>Add Liquidity</Text>
              </HStack>

              <LiquiditySelectToken isToken1 />

              <Icon as={AiOutlinePlus} fontSize="xl" />

              <LiquiditySelectToken />

              <Button
                type="submit"
                isLoading={isSubmitting}
                isDisabled={!isValid || !walletConnected}
                variant="brand-2-outline"
                w="full"
                fontSize={{ base: "sm", sm: "md" }}
              >
                {walletConnected
                  ? isValid
                    ? "Add Liquidity"
                    : errors.token1 ||
                      errors.token1Amount ||
                      errors.token2Amount
                  : "Connect Wallet to Continue"}
              </Button>
              <Text
      textAlign="center"
      variant="subtext"
      w="full"
      overflow="hidden"
      >Supply two tokens in equal values</Text>
            </VStack>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

AddLiquidity.getLayout = Layout;

export default AddLiquidity;
