import "../styles/globals.css";
import "@fontsource/nunito/400.css";
import "@fontsource/nunito/600.css";
import "@fontsource/nunito/700.css";
import "@fontsource/nunito/800.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout";
import { useEffect, useState } from "react";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import { Web3Auth } from "@web3auth/web3auth";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { Web3AuthContext } from "../lib/web3auth";
import Head from "next/head";

function App({ Component, pageProps }: AppProps) {
  const [instance, setInstance] = useState<Web3Auth | null>(null);

  useEffect(() => {
    const web3auth = new Web3Auth({
      clientId: process.env.NEXT_PUBLIC_W3A_CLIENT_ID as string,
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0x504",
        rpcTarget: "https://rpc.api.moonbeam.network",
        displayName: "Moonbeam Mainnet",
        blockExplorer: "https://moonbeam.moonscan.io",
        ticker: "GLMR",
        tickerName: "GLMR",
      },
      uiConfig: {
        appLogo: "/logo.svg",
        theme: "dark",
      },
    });
    const metamaskAdapter = new MetamaskAdapter({});
    web3auth.configureAdapter(metamaskAdapter);
    web3auth
      .initModal()
      .then(() => setInstance(web3auth))
      .then(console.log);
  }, []);

  return (
    <Web3AuthContext.Provider value={instance}>
      <Head>
        <title>Moonboard - Real-time web3 alerts</title>
      </Head>
      <Layout user={(pageProps as any).user}>
        <Component {...pageProps} />
      </Layout>
    </Web3AuthContext.Provider>
  );
}

export default App;
