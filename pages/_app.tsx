import "../styles/globals.css";
import "@fontsource/nunito/400.css";
import "@fontsource/nunito/600.css";
import "@fontsource/nunito/700.css";
import "@fontsource/nunito/800.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import { WagmiConfig } from "wagmi";
import { client } from "../lib/wagmi";
import NextNProgress from "nextjs-progressbar";

function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <Head>
        <title>Moonboard - Real-time web3 alerts</title>
      </Head>
      <Toaster />
      <NextNProgress
        color="#fff"
        height={1}
        options={{ showSpinner: false, trickleSpeed: 100 }}
      />
      <Layout user={(pageProps as any).user}>
        {(login) => <Component {...pageProps} login={login} />}
      </Layout>
    </WagmiConfig>
  );
}

export default App;
