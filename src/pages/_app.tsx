import type { AppProps } from "next/app";
import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import theme from "../theme";
import { MetaMask } from "@web3-react/metamask";
import { metaMaskHooks, metaMask } from "../connectors/metaMask";
import { Web3ReactProvider } from "@web3-react/core";

// Fonts
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/700.css";

import "@fontsource/lato/300.css";
import "@fontsource/lato/400.css";
import "@fontsource/lato/700.css";
import "@fontsource/lato/900.css";
import { Web3ReactHooks } from "@web3-react/core";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const connectors: [MetaMask, Web3ReactHooks][] = [[metaMask, metaMaskHooks]];

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Axoswap</title>
      </Head>
      <Web3ReactProvider connectors={connectors}>
        <ChakraProvider theme={theme}>
          {getLayout(<Component {...pageProps} />)}
        </ChakraProvider>
      </Web3ReactProvider>
    </>
  );
}

export default MyApp;
